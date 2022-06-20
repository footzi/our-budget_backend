import { Controller, Post, UseGuards, Request, Body, Delete, Put, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { errorHandler } from '../utils/errorHandler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { successHandler } from '../utils/successHandler';
import { User } from '../users/interfaces/users.interface';
import { Tokens } from './interfaces/auth.interfaces';
import { SignUpDto } from './dto/signup.dto';

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
