import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Role } from './role/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { MailService } from 'src/mail/mail.service';
import { ResetPass } from 'src/mail/dto/resetPass.dto';
import { ForgotPassword } from 'src/mail/dto/forgot-pass.dto';
import { SiginDto } from './dto/sigin.dto';
import { SessionService } from 'src/session/session.service';
import { LockAccount } from './lock/lock.entity';
import { UserRegister } from './dto/user-register.dto';
import { encryptData, decryptData } from '../utils/encrypt-file';
import { CheckEmailService } from 'src/check-email/check-email.service';
import { ForgotPassTest } from 'src/mail/dto/forgot-pass-test.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(LockAccount)
    private lockRepository: Repository<LockAccount>,
    private mailService: MailService,
    private sessionService: SessionService,
    private checkEmailService: CheckEmailService,
  ) {}

  async getRoleDefature(): Promise<Role[]> {
    const query = this.roleRepository.createQueryBuilder('role');
    query.where('role.name LIKE (:status)', { status: `user` });
    const roles = await query.getMany();
    return roles;
  }
  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<UserRegister> {
    const { username, password, email } = authCredentialsDto;
    const roleUsers = await this.getRoleDefature();
    console.log(roleUsers);
    if (roleUsers == null || roleUsers.length == 0) {
      return;
    }
    const emails = await this.usersRepository.findOne({ where: { email } });
    if (emails) {
      throw new ConflictException('Email exit');
    }
    const roleUser = roleUsers[0];
    console.log(roleUser);
    // console.log(role);

    const salf = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salf);
    console.log('salty', salf);
    console.log('hashedPassword', hashedPassword);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      email,
      role: roleUser,
    });
    try {
      await this.usersRepository.save(user);
      const userRegister = new UserRegister();
      userRegister.email = user.email;
      userRegister.username = user.username;
      userRegister.role = user.role;
      return userRegister;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username alrealy exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<UserRegister> {
    return this.createUser(authCredentialsDto);
  }
  async signIn(siginDto: SiginDto): Promise<{
    accessToken: string;
    username: string;
    role: string;
    userId: any;
  }> {
    const { username, password } = siginDto;

    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && user.lock == true) {
      throw new HttpException('Account block', HttpStatus.FORBIDDEN);
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('yes');
      console.log(user);
      const role = user.role.name;
      const userId = user.id;
      // return 'succes';
      const payload: JwtPayload = { username, role };
      const accessToken: string = await this.jwtService.sign(payload);
      await this.mailService.sendUserConfirmation(user, accessToken);

      const payloadToken = await this.jwtService.verifyAsync(accessToken, {
        secret: 'topSecret51',
      });
      console.log('payloadToken');
      const convertTime = new Date(payloadToken.exp * 1000);
      console.log(convertTime);

      await this.sessionService.craeteSession(user, accessToken, convertTime);
      const lockAccount = await this.lockRepository.findOne({
        where: { user },
      });
      if (lockAccount) {
        await this.lockRepository.delete(lockAccount.id);
      }

      return { accessToken, username, role, userId };
    } else {
      await this.lockAccount(username);
      throw new UnauthorizedException('Please username or password wrong');
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createRole(createRoleDto: CreateRoleDto, req): Promise<Role> {
    console.log(req.user.role);
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException();
    }
    const username = req.user.username;
    const user = await this.usersRepository.findOne({ where: { username } });
    const checkSession = await this.sessionService.getSessionByUserId(user);
    if (checkSession && checkSession.isExp == true) {
      throw new UnauthorizedException('Plaese login! Thank');
    }
    const { name } = createRoleDto;
    const checkRole = await this.roleRepository.findOne({ where: { name } });
    if (checkRole) {
      throw new ConflictException('role alrealy exists');
    } else {
      const role = this.roleRepository.create({
        name,
      });
      await this.roleRepository.save(role);
      return role;
    }
  }
  async resetPassLink(resetPass: ResetPass): Promise<string> {
    const { email } = resetPass;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('email not exit');
    }

    await this.mailService.sendPassResetLink(resetPass, user);
    throw new HttpException('successfully', HttpStatus.OK);
  }

  async forgotPassword(forgotPass: ForgotPassTest) {
    const { email, newPass } = forgotPass;
    const user = await this.usersRepository.findOne({ where: { email } });
    console.log(user);
    if (!user) {
      throw new NotFoundException();
    } else {
      const salf = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPass, salf);
      console.log(hashedPassword);
      user.password = hashedPassword;
    }
    console.log(user.password);
    await this.usersRepository.update(user.id, user);

    return user;
  }
  async logout(req): Promise<string> {
    // console.log(req);
    const token = await this.getToken(req);
    // console.log('token: ', token);
    const username = req.user.username;
    const user = await this.usersRepository.findOne({ where: { username } });

    await this.sessionService.updateIsExp(user, token);
    throw new HttpException('Successfully', HttpStatus.OK);
  }
  async getUserByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user;
  }
  async getToken(req): Promise<string> {
    const { rawHeaders } = req;
    if (rawHeaders.includes('Authorization')) {
      // console.log(rawHeaders);

      let authorizationIndex = rawHeaders.indexOf('Authorization');
      authorizationIndex += 1;
      const token = rawHeaders[authorizationIndex].split(' ');
      // console.log('bearer token: ', token);
      let tokenIndex = token.indexOf('Bearer');
      tokenIndex += 1;
      const tokenfix = token[tokenIndex];
      // console.log(tokenfix);
      return tokenfix;
    }
  }
  async getInformation(req): Promise<User> {
    const username = req.user.username;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async lockAccount(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    // console.log(user);
    if (user) {
      const lockAccount = await this.lockRepository.findOne({
        where: { user },
      });
      if (lockAccount) {
        if (lockAccount.count <= 3) {
          console.log(lockAccount.count++);
          lockAccount.count = lockAccount.count++;
          await this.lockRepository.update(lockAccount.id, lockAccount);
        } else {
          user.lock = true;
          console.log(user);
          await this.usersRepository.update(user.id, user);
          await this.lockRepository.delete(lockAccount.id);
        }
      } else {
        const saveLock = await this.lockRepository.create({
          count: 1,
          user,
        });
        await this.lockRepository.save(saveLock);
      }
    }
  }
  async forgotPasswordEmail(forgotPass: ForgotPassword) {
    try {
      const { iv, encryptedData, newPass } = forgotPass;
      const object = { iv: iv, encryptedData: encryptedData };
      const check = await this.checkEmailService.getCheckEmail(
        object.iv,
        object.encryptedData,
      );
      if (!check) {
        return;
      }
      // console.log(object);
      // const username = decryptData(object);
      const username = decryptData(object);
      console.log(username);
      const user = await this.usersRepository.findOne({ where: { username } });
      console.log(user);
      if (!user) {
        throw new NotFoundException();
      } else {
        const salf = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPass, salf);
        console.log(hashedPassword);
        user.password = hashedPassword;
      }
      console.log(user.password);
      await this.usersRepository.update(user.id, user);
      await this.checkEmailService.delete(object.iv, object.encryptedData);
      const userDto = new UserRegister();
      userDto.email = user.email;
      userDto.username = user.username;
      userDto.role = user.role;
      return userDto;
    } catch (error) {
      throw new UnauthorizedException('Time out');
    }
  }
}
