import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { string } from 'joi';
import { EMPTY } from 'rxjs';
import { Role } from './role/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private mailService: MailService,
  ) {}

  async getRoleDefature(): Promise<Role[]> {
    const query = this.roleRepository.createQueryBuilder('role');
    query.where('role.name LIKE (:status)', { status: `user` });
    const roles = await query.getMany();
    return roles;
  }
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, email } = authCredentialsDto;
    const roleUsers = await this.getRoleDefature();
    console.log(roleUsers);
    if (roleUsers == null || roleUsers.length == 0) {
      return;
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
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username alrealy exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.createUser(authCredentialsDto);
  }
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(user);
      const role = user.role.name;
      // return 'succes';
      const payload: JwtPayload = { username, role };
      const accessToken: string = await this.jwtService.sign(payload);
      await this.mailService.sendUserConfirmation(user, accessToken);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please username or password wrong');
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createRole(createRoleDto: CreateRoleDto, req): Promise<Role> {
    console.log(req.user.role);
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException();
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
}
