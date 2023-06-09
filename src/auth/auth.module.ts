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
    TypeOrmModule.forFeature([User, Role]),
    MailModule,
  ],
  providers: [AuthService, JwtStratery],
  controllers: [AuthController, RoleController],
  exports: [JwtStratery, PassportModule],
})
export class AuthModule {}
