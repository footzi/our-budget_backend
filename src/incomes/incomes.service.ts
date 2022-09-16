import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { BalanceService } from '../balance/balance.service';
import { Categories } from '../categories/entities/categories.entity';
import { Users } from '../users/entities/users.entity';
import { User } from '../users/interfaces/users.interface';
import { AddIncomeFactDto } from './dto/add-income-fact.dto';
import { AddIncomePlanDto } from './dto/add-income-plan.dto';
import { UpdateIncomeFactDto } from './dto/update-income-fact.dto';
import { UpdateIncomePlanDto } from './dto/update-income-plan.dto';
import { IncomesFact } from './entities/incomes-fact.entity';
import { IncomesPlan } from './entities/incomes-plan.entity';
import { Income } from './interfaces/income.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(IncomesPlan)
    private incomePlanRepository: Repository<Income>,

    @InjectRepository(IncomesFact)
    private incomeFactRepository: Repository<Income>,

    private balanceService: BalanceService
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
      category: category,
      user: savedUser,
    };

    return income;
  }

  /**
   * Изменяет баланс при добавлении факта
   */
  private async changeBalanceAdd(userId: number, fact: Income) {
    const value = fact.value;
    await this.balanceService.changeBalance(userId, value);
  }

  /**
   * Изменяет баланс при обновлении факта
   */
  private async changeBalanceUpdate(userId: number, fact: Income, previousFact: Income) {
    const value = Number(fact.value) - previousFact.value;
    await this.balanceService.changeBalance(userId, value);
  }

  /**
   * Изменяет баланс при удалении факта
   */
  private async changeBalanceDelete(userId: number, previousItem: Income) {
    const value = -previousItem.value;
    await this.balanceService.changeBalance(userId, value);
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
    // @todo вынести в какой-нибудь валидатор
    if (!start || !end || !userId) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.incomePlanRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
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
   * Получает cумму планируемых доходов по дате
   */
  async getPlansSumByPeriod(start: string, end: string, userId: number) {
    if (!start || !end || !userId) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const items = await this.incomePlanRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
        user: {
          id: userId,
        },
      },
      select: ['value'],
    });

    return items.reduce((acc, item) => acc + item.value, 0);
  }

  /**
   * Получает cумму фактических доходов по дате
   */
  async getFactsSumByPeriod(start: string, end: string, userId: number) {
    if (!start || !end || !userId) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const items = await this.incomeFactRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
        user: {
          id: userId,
        },
      },
      select: ['value'],
    });

    return items.reduce((acc, item) => acc + item.value, 0);
  }

  /**
   * Получает спискок фактических доходов по дате
   */
  getAllFactsByPeriod(start: string, end: string, userId: number): Promise<Income[]> {
    // @todo вынести в какой-нибудь валидатор
    if (!start || !end || !userId) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.incomeFactRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
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
