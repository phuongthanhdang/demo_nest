import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from './session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from 'src/auth/user.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async craeteSession(user: User, token: string, createAt) {
    const found = await this.sessionRepository.findOne({
      where: { user, token },
    });
    if (!found) {
      const session = this.sessionRepository.create({
        user,
        token,
        isExp: false,
        createAt,
      });
      await this.sessionRepository.save(session);
      return session;
    } else {
      found.token = token;
      found.createAt = createAt;
      found.isExp = false;
      await this.sessionRepository.update(found.id, found);
      return found;
    }
  }
  async getSessionByUserId(user: User): Promise<Session> {
    const found = await this.sessionRepository.findOne({ where: { user } });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
  async updateSession(id: string, token: string, exp: Date, session: Session) {
    session.token = token;
    session.createAt = exp;
    await this.sessionRepository.update(id, session);
    return session;
  }
  async updateIsExp(user: User, token: string) {
    const found = await this.sessionRepository.findOne({
      where: { user, token },
    });
    if (!found) {
      throw new NotFoundException();
    } else {
      found.isExp = true;
      await this.sessionRepository.update(found.id, found);
      return found;
    }
  }
  async getSesionByToken(token: string) {
    const session = await this.sessionRepository.findOne({ where: { token } });
    const { isExp } = session;
    if (session && isExp == true) {
      throw new UnauthorizedException('Please login! Thank');
    }
  }
}
