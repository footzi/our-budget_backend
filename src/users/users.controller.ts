import { Controller, Get, HttpCode, Request, UseGuards } from '@nestjs/common';
import { errorHandler } from '../utils/errorHandler';
import { User } from './interfaces/users.interface';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async getById(@Request() req): Promise<{ user: User }> {
    try {
      return {
        user: await this.usersService.getById(req.user.id),
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
