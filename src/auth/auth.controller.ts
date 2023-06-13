import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { promises } from 'dns';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './role/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetUser } from './get-user.decorator';
import User from './user.entity';
import { ResetPass } from 'src/mail/dto/resetPass.dto';
import { ForgotPassword } from 'src/mail/dto/forgot-pass.dto';
import { SiginDto } from './dto/sigin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  signIn(@Body() siginDto: SiginDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(siginDto);
  }
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }

  @Get('/welcome')
  welcome() {
    return {
      message: 'Welcome to our application',
    };
  }
  // @Get('/get-role')
  // getRole(): Promise<Role[]> {
  //   return this.authService.getRoleDefature();
  // }
  // @Post('/create-role')
  // createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
  //   return this.authService.createRole(createRoleDto);
  // }

  @Post('/send-password-reset-link')
  resetPassLink(@Body() resetpass: ResetPass) {
    return this.authService.resetPassLink(resetpass);
  }
  @Post('/forgot-password')
  forgotPassword(@Body() forgotPass: ForgotPassword) {
    return this.authService.forgotPassword(forgotPass);
  }
}
