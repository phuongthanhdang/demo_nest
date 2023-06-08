import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { promises } from 'dns';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './role/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetUser } from './get-user.decorator';
import User from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }
  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
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
}
