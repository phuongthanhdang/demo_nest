import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Request,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// import { AuthGuard } from '@nestjs/passport';
import { ResetPass } from 'src/mail/dto/resetPass.dto';
import { ForgotPassword } from 'src/mail/dto/forgot-pass.dto';
import { SiginDto } from './dto/sigin.dto';
import { AuthGuard } from './auth.guard';
import { ForgotPassTest } from 'src/mail/dto/forgot-pass-test.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  signIn(@Body() siginDto: SiginDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(siginDto);
  }
  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@Req() req) {
  //   console.log(req);
  // }

  @Get('/welcome')
  welcome() {
    return {
      message: 'Welcome to our application',
    };
  }
  @Post('/send-password-reset-link')
  resetPassLink(@Body() resetpass: ResetPass): Promise<string> {
    return this.authService.resetPassLink(resetpass);
  }
  @Post('/forgot-password')
  forgotPassword(@Body() forgotPass: ForgotPassTest) {
    return this.authService.forgotPassword(forgotPass);
  }
  @UseGuards(AuthGuard)
  @Post('/information')
  getInformation(@Request() req) {
    return this.authService.getInformation(req);
  }
  @Post('/forgot-password-email')
  forgotPasswordEmail(@Body() forgotPass: ForgotPassword) {
    return this.authService.forgotPasswordEmail(forgotPass);
  }
}
