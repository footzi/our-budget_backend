import { Body, Controller, Delete, HttpCode, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../users/interfaces/users.interface';
import { errorHandler } from '../utils/errorHandler';
import { successHandler } from '../utils/successHandler';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Tokens } from './interfaces/auth.interfaces';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/api/auth/login')
  async login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      errorHandler(error);
    }
  }

  @HttpCode(201)
  @Post('/api/auth/signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<{ user: User; tokens: Tokens }> {
    try {
      return this.authService.signUp(signUpDto);
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(AuthGuard('jwt-refreshtoken'))
  @Put('/api/auth/refresh')
  async refresh(@Request() req): Promise<{ user: User; tokens: Tokens }> {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/auth/logout')
  async logout(@Request() req) {
    try {
      await this.authService.logout(req.user.id);
      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }
}
