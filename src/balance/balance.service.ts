import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balances } from './enitites/balance.entity';
import { Users } from '../users/entities/users.entity';
import { Balance } from './interfaces/balance.interface';
import { User } from '../users/interfaces/users.interface';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balances)
    private balanceRepository: Repository<Balance>
  ) {}

  /**
   * Возвращает общий баланс (разница между доходами и расходами)
   */
  async getCommon(user: User): Promise<number> {
    const balance = await this.balanceRepository.findOne({
      where: { user: { id: user.id } },
    });

    return balance.common;
  }

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
  }
}
