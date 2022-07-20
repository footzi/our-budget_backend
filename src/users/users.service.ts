import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './interfaces/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Crypt } from '../utils/crypt';
import { USER_ROLES } from './users.constants';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<User>
  ) {}

  /**
   * Поиск пользователя по логину
   * @param {string} login - логин
   */
  async findByLogin(login: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ login });
  }

  /**
   * Создание нового пользователя
   */
  async create(createUserDTO: CreateUserDto): Promise<User> {
    if (!createUserDTO.login || !createUserDTO.password || !createUserDTO.firstName) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const findedUser = await this.findByLogin(createUserDTO.login);

    if (findedUser) {
      throw new HttpException('Пользователь с данным логином уже существует', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = createUserDTO.password ? await Crypt.hash(createUserDTO.password) : '';

    const user: User = {
      ...createUserDTO,
      roles: [USER_ROLES.USER],
      password: hashedPassword,
    };

    const newUser = await this.usersRepository.save(user);
    delete newUser.password;

    return newUser;
  }

  /**
   * Возвращает пользователя
   * @param id
   */
  async getById(id: number): Promise<User> {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    delete user.password;
    delete user.roles;

    return user;
  }

  /**
   * Обновляет данные пользователя
   */
  async update(updateUserDto: UpdateUserDto, user: User): Promise<void> {
    await this.usersRepository.update(user.id, updateUserDto);
  }
}
