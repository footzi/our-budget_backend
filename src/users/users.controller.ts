import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
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
  async getById(@Param('id') id: number): Promise<{ user: User }> {
    try {
      const user = await this.usersService.findById(id);
      delete user.password;
      delete user.roles;

      if (user) {
        return {
          user,
        };
      } else {
        throw new Error('Пользователь не найден');
      }
    } catch (error) {
      errorHandler(error);
    }
  }

  // @Post()
  // @HttpCode(201)
  // async create(@Body() createUserDTO: CreateUserDto): Promise<{ user: User }> {
  //   try {
  //     return {
  //       user: await this.usersService.create(createUserDTO),
  //     };
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @SetMetadata('roles', [USER_ROLES.ADMIN])
  // @Get('allClients')
  // @HttpCode(200)
  // async getAllActiveClients(): Promise<{ clients: Client[] }> {
  //   try {
  //     return {
  //       clients: await this.usersService.getAllClients(),
  //     };
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // }
}
