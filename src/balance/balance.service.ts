import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import { Logger } from 'winston';

import { Users } from '../users/entities/users.entity';
import { User } from '../users/interfaces/users.interface';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { Balances } from './enitites/balance.entity';
import { Balance } from './interfaces/balance.interface';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balances)
    private balanceRepository: Repository<Balance>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  /**
   * Возвращает общий баланс
   */
  async getCommon(user: User): Promise<number> {
    const balance = await this.balanceRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!balance) {
      return 0;
    }

    return balance.common;
  }

  /**
   * Изменяет баланс
   */
  public async changeBalance(userId: number, value: number) {
    const current = await this.balanceRepository.findOne({
      where: { user: { id: userId } },
    });

    if (current) {
      const newValue = current.common + value;

      await this.balanceRepository.update(current.id, { common: newValue });
    }

    if (!current) {
      const balance = new Balances();
      const user = new Users();

      user.id = userId;
      balance.user = user;
      balance.common = value;

      await this.balanceRepository.save(balance);
    }

    this.logger.info(`Изменение баланса у пользователя ${userId}`);
  }

  /**
   * Обновляет баланс
   */
  async update(updateBalanceDto: UpdateBalanceDto, user: User): Promise<void> {
    if (!updateBalanceDto.common) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const current = await this.balanceRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!current) {
      const balance = new Balances();
      const newUser = new Users();

      newUser.id = user.id;
      balance.user = newUser;
      balance.common = updateBalanceDto.common;

      await this.balanceRepository.save(balance);
    }

    await this.balanceRepository.update({ user: { id: user.id } }, updateBalanceDto);

    this.logger.info(`Обновление баланса у пользователя ${user.id}`);
  }
}
