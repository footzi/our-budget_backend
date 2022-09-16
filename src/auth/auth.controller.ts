import { Body, Controller, Delete, HttpCode, Inject, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { errorHandler } from '../utils/errorHandler';
import { ErrorHandler } from '../utils/errorHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { AuthService } from './auth.service';
import { LoginOutDto } from './dto/login.dto';
import { RefreshOutDto } from './dto/refresh.dto';
import { SignUpDto, SignUpOutDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/api/auth/login')
  @ApiOkResponse({ type: LoginOutDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async login(@Request() req): Promise<LoginOutDto> {
    try {
      return await this.authService.login(req.user);
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @HttpCode(201)
  @Post('/api/auth/signup')
  @ApiCreatedResponse({ type: SignUpOutDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async signup(@Body() signUpDto: SignUpDto, @Request() req): Promise<SignUpOutDto> {
    try {
      return await this.authService.signUp(signUpDto);
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(AuthGuard('jwt-refreshtoken'))
  @Put('/api/auth/refresh')
  @ApiOkResponse({ type: RefreshOutDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async refresh(@Request() req): Promise<RefreshOutDto> {
    try {
      return await this.authService.login(req.user);
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/auth/logout')
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async logout(@Request() req): Promise<SuccessHandler> {
    try {
      await this.authService.logout(req.user.id);
      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }
}
