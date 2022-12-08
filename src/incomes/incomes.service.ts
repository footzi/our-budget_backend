import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { BalanceService } from '../balance/balance.service';
import { Categories } from '../categories/entities/categories.entity';
import { CurrenciesValues } from '../currencies/curerncies.interfaces';
import { DEFAULT_CURRENCY } from '../currencies/currencies.constants';
import { Date } from '../date/date.index';
import { Users } from '../users/entities/users.entity';
import { User } from '../users/interfaces/users.interface';
import { ValidatorService } from '../validator/validator.service';
import { AddIncomeFactDto } from './dto/add-income-fact.dto';
import { AddIncomePlanDto } from './dto/add-income-plan.dto';
import { UpdateIncomeFactDto } from './dto/update-income-fact.dto';
import { UpdateIncomePlanDto } from './dto/update-income-plan.dto';
import { IncomesFact } from './entities/incomes-fact.entity';
import { IncomesPlan } from './entities/incomes-plan.entity';
import { Income } from './interfaces/income.interface';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(IncomesPlan)
    private incomePlanRepository: Repository<Income>,

    @InjectRepository(IncomesFact)
    private incomeFactRepository: Repository<Income>,

    private balanceService: BalanceService,

    private readonly validator: ValidatorService
  ) {}

  /**
   * Создает доход
   */
  private createIncome(
    input: AddIncomePlanDto | AddIncomeFactDto | UpdateIncomePlanDto | UpdateIncomeFactDto,
    userId: number
  ) {
    // @todo вынести в какой-нибудь валидатор
    if (!input.value || !input.date || !input.categoryId) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const category = new Categories();
    category.id = input.categoryId;

    const savedUser = new Users();
    savedUser.id = userId;

    const income: Income = {
      value: input.value,
      date: input.date,
      comment: input.comment ?? '',
      currency: input.currency,
      category: category,
      user: savedUser,
    };

    return income;
  }

  /**
   * Изменяет баланс при добавлении факта
   */
  private async changeBalanceAdd(userId: number, fact: Income) {
    const { value, currency } = fact;
    await this.balanceService.increment(userId, value, currency);
  }

  /**
   * Изменяет баланс при обновлении факта
   */
  private async changeBalanceUpdate(userId: number, fact: Income, previousFact: Income) {
    const { currency } = fact;
    const value = Number(fact.value) - previousFact.value;
    await this.balanceService.increment(userId, value, currency);
  }

  /**
   * Изменяет баланс при удалении факта
   */
  private async changeBalanceDelete(userId: number, previousItem: Income) {
    const { currency } = previousItem;
    const value = -previousItem.value;
    await this.balanceService.increment(userId, value, currency);
  }

  /**
   * Добавляет плановый расход
   */
  async addPlan(addIncomePlan: AddIncomePlanDto, user: User): Promise<Income> {
    const income = this.createIncome(addIncomePlan, user.id);

    const newIncome = await this.incomePlanRepository.save(income);
    delete newIncome.user;

    return newIncome;
  }

  /**
   * Изменяет плановый доход
   */
  async changePlan(updateIncomePlan: UpdateIncomePlanDto, user: User): Promise<void> {
    if (!updateIncomePlan.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const income = this.createIncome(updateIncomePlan, user.id);

    await this.incomePlanRepository.update(updateIncomePlan.id, income);
  }

  /**
   * Удаляет плановый доход
   */
  async deletePlan(id: number): Promise<void> {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    await this.incomePlanRepository.delete(id);
  }

  /**
   * Добавляет фактический доход
   */
  async addFact(addIncomeFact: AddIncomeFactDto, user: User): Promise<Income> {
    const income = this.createIncome(addIncomeFact, user.id);

    const newIncome = await this.incomeFactRepository.save(income);
    delete newIncome.user;

    await this.changeBalanceAdd(user.id, income);

    return newIncome;
  }

  /**
   * Изменяет фактический доход
   */
  async changeFact(updateIncomeFact: UpdateIncomeFactDto, user: User): Promise<void> {
    if (!updateIncomeFact.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const previousFact = await this.incomeFactRepository.findOne({
      where: { id: updateIncomeFact.id },
    });

    const income = this.createIncome(updateIncomeFact, user.id);

    await this.incomeFactRepository.update(updateIncomeFact.id, income);
    await this.changeBalanceUpdate(user.id, income, previousFact);
  }

  /**
   * Удаляет фактический расход
   */
  async deleteFact(id: number, user: User): Promise<void> {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const previousItem = await this.incomeFactRepository.findOne({
      where: { id },
    });

    await this.incomeFactRepository.delete(id);
    await this.changeBalanceDelete(user.id, previousItem);
  }

  /**
   * Получает список планируемых доходов по дате
   */
  getAllPlansByPeriod(start: string, end: string, userId): Promise<Income[]> {
    this.validator.getIsRequiredFields(userId, start, end);

    return this.incomePlanRepository.find({
      where: {
        date: Between(Date.toFormat(start), Date.toFormat(end)),
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['category'],
    });
  }

  /**
   * Получает список фактических доходов по дате
   */
  getAllFactsByPeriod(start: string, end: string, userId: number): Promise<Income[]> {
    this.validator.getIsRequiredFields(userId, start, end);

    return this.incomeFactRepository.find({
      where: {
        date: Between(Date.toFormat(start), Date.toFormat(end)),
        user: {
          id: userId,
        },
      },
      order: {
        date: 'DESC',
      },
      relations: ['category'],
    });
  }

  /**
   * Возвращает общую сумму по записям в разрезе валют
   */
  calculateTotalSum(items: Income[]): CurrenciesValues {
    return items.reduce(
      (acc, item) => {
        const { currency, value } = item;
        acc[currency] = acc[currency] ? acc[currency] + value : value;

        return acc;
      },
      { [DEFAULT_CURRENCY]: 0 }
    );
  }

  /**
   * Получение фактов по id категории
   */
  getFactsByCategory(categoryId: number) {
    return this.incomeFactRepository.find({
      where: {
        category: {
          id: categoryId,
        },
      },
    });
  }

  /**
   * Получение планов по id категории
   */
  getPlansByCategory(categoryId: number) {
    return this.incomePlanRepository.find({
      where: {
        category: {
          id: categoryId,
        },
      },
    });
  }
}
