import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from './role.entity';
import { AuthGuard } from '../auth.guard';
import User from '../user.entity';
// import { AuthGuard } from '@nestjs/passport';
// import { AuthGuard } from './auth.guard';

@Controller('role')
// @UseGuards(AuthGuard())
export class RoleController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Post('/create-role')
  createRole(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req,
  ): Promise<Role> {
    return this.authService.createRole(createRoleDto, req);
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
  @UseGuards(AuthGuard)
  @Get('/logout')
  getProfile(@Request() req) {
    return this.authService.logout(req);
  }
}
