import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BalanceService } from '../balance/balance.service';
import { DEFAULT_CURRENCY } from '../currencies/currencies.constants';
import { Crypt } from '../utils/crypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/users.entity';
import { User } from './interfaces/users.interface';
import { USER_ROLES } from './users.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<User>,

    private balanceService: BalanceService
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

    const foundUser = await this.findByLogin(createUserDTO.login);

    if (foundUser) {
      throw new HttpException('Пользователь с данным e-mail уже существует', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = createUserDTO.password ? await Crypt.hash(createUserDTO.password) : '';

    const user: User = {
      ...createUserDTO,
      roles: [USER_ROLES.USER],
      password: hashedPassword,
      currencies: [DEFAULT_CURRENCY],
    };

    const newUser = await this.usersRepository.save(user);
    delete newUser.password;

    await this.balanceService.create(newUser.id);

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
   * @todo везде привести к такой сигнатуре
   */
  async update(userId: number, updateUserDto: UpdateUserDto): Promise<void> {
    if (!userId) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const currentUser = await this.usersRepository.findOneBy({ id: userId });

    if (!currentUser) {
      throw new Error('Пользователь не найден');
    }

    // обновляем валюты в балансе
    const isChangeCurrencies = JSON.stringify(updateUserDto.currencies) !== JSON.stringify(currentUser.currencies);

    if (isChangeCurrencies) {
      await this.balanceService.updateByCurrency(userId, updateUserDto.currencies);
    }

    await this.usersRepository.update(userId, updateUserDto);
  }
}
