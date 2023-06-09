import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStratery } from './jwt.strategy';
import { Role } from './role/role.entity';
import { RoleController } from './role/role.controller';
import { MailModule } from 'src/mail/mail.module';
import { SessionModule } from 'src/session/session.module';
import { AuthGuard } from './auth.guard';
import { LockAccount } from './lock/lock.entity';
import { CheckEmailModule } from 'src/check-email/check-email.module';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User, Role, LockAccount]),
    MailModule,
    SessionModule,
    CheckEmailModule,
  ],
  providers: [AuthService, JwtStratery, AuthGuard],
  controllers: [AuthController, RoleController],
  exports: [JwtStratery, PassportModule, AuthService],
})
export class AuthModule {}
