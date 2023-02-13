import { Body, Controller, Get, HttpCode, Inject, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ErrorHandler } from '../utils/errorHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDtoInput, ResetPasswordDtoOutput } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/users.interface';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getById(@Request() req): Promise<{ user: User }> {
    try {
      return {
        user: await this.usersService.getById(req.user.id),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.usersService.update(req.user.id, updateUserDto);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @Post('/reset-password')
  @HttpCode(200)
  @ApiOkResponse({ type: ResetPasswordDtoInput })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDtoInput,
    @Request() req
  ): Promise<ResetPasswordDtoOutput> {
    try {
      return {
        // @todo пока нет нормальной реализации сброса пароля
        // hash: await this.usersService.resetPassword(resetPasswordDto.login),
        hash: '0',
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.usersService.changePassword(req.user.id, changePasswordDto);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }
}
