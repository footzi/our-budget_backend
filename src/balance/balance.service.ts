import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import { Logger } from 'winston';

import { CURRENCIES } from '../currencies/currencies.constants';
import { Users } from '../users/entities/users.entity';
import { ValidatorService } from '../validator/validator.service';
import { Balances } from './enitites/balance.entity';
import { Balance } from './interfaces/balance.interface';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balances)
    private balanceRepository: Repository<Balance>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,

    private readonly validator: ValidatorService
  ) {}

  /**
   * Возвращает баланс с валютами
   */
  async get(userId: number): Promise<Balance> {
    this.validator.getIsRequiredFields(userId);

    return await this.balanceRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  /**
   * Создает баланс
   */
  async create(userId: number) {
    this.validator.getIsRequiredFields(userId);

    const balance = new Balances();
    const user = new Users();

    user.id = userId;
    balance.user = user;
    // @todo удалить столбец
    balance.common = 0;

    await this.balanceRepository.save(balance);
  }

  /**
   * Обновляет значение баланса
   */
  async update(userId: number, value: number, currency: CURRENCIES) {
    this.validator.getIsRequiredFields(userId, value, currency);

    const { id, values } = await this.get(userId);
    values[currency] = value;

    await this.balanceRepository.update(id, { values });

    this.logger.info(`Обновление баланса у пользователя ${userId}`);
  }

  /**
   * Прибавляет значение к текущему балансу
   */
  async increment(userId: number, value: number, currency: CURRENCIES) {
    this.validator.getIsRequiredFields(userId, value, currency);

    const { id, values } = await this.get(userId);
    const currentValue = values[currency];
    const sum = currentValue + value;

    values[currency] = Number(sum.toFixed(2));

    await this.balanceRepository.update(id, { values });

    this.logger.info(`Изменение баланса у пользователя ${userId}`);
  }

  /**
   * Добавляет новую валюту к балансу
   */
  async addCurrency(userId: number, currency: CURRENCIES, value = 0) {
    this.validator.getIsRequiredFields(userId, currency, value);

    const { id, values } = await this.get(userId);
    values[currency] = value;

    await this.balanceRepository.update(id, { values });

    this.logger.info(`Пользователь ${userId} добавил валюту ${currency} к балансу`);
  }

  /**
   * Удаляет значение баланса по валюте
   */
  async removeCurrency(userId: number, currency: CURRENCIES) {
    this.validator.getIsRequiredFields(userId, currency);

    const { id, values } = await this.get(userId);
    delete values[currency];

    await this.balanceRepository.update(id, { values });

    this.logger.info(`Пользователь ${userId} удалил валюту ${currency} у баланса`);
  }

  /**
   * Обновляет список баланса исходя из новых валют
   */
  async updateByCurrency(userId: number, newCurrencies: CURRENCIES[]) {
    this.validator.getIsRequiredFields(userId, newCurrencies);

    const { values } = await this.balanceRepository.findOne({
      where: { user: { id: userId } },
    });

    // сначала удаляем
    for (const value of Object.keys(values)) {
      const currency = value as CURRENCIES;
      if (!newCurrencies.includes(currency)) {
        await this.removeCurrency(userId, currency);
      }
    }

    for (const currency of newCurrencies) {
      if (!(currency in values)) {
        await this.addCurrency(userId, currency);
      }
    }
  }
}
