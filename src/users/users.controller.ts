import { Body, Controller, Get, HttpCode, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ErrorHandler } from '../utils/errorHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/users.interface';
import { UsersService } from './users.service';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.usersService.update(updateUserDto, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }
}
