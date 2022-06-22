import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { IncomesPlan } from './entities/incomes-plan.entity';
import { User } from '../users/interfaces/users.interface';
import { Categories } from '../categories/entities/categories.entity';
import { Users } from '../users/entities/users.entity';
import { IncomesFact } from './entities/incomes-fact.entity';
import { Income } from './interfaces/income.interface';
import { AddIncomePlanDto } from './dto/add-income-dto-plan';
import { AddIncomeFactDto } from './dto/add-income-dto-fact';
import { UpdateIncomePlanDto } from './dto/update-income-plan.dto';
import { UpdateIncomeFactDto } from './dto/update-income-fact.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(IncomesPlan)
    private incomePlanRepository: Repository<Income>,

    @InjectRepository(IncomesFact)
    private incomeFactRepository: Repository<Income>
  ) {}

  /**
   * Создает доход
   */
  private createIncome(
    input: AddIncomePlanDto | AddIncomeFactDto | UpdateIncomePlanDto | UpdateIncomeFactDto,
    userId: number
  ) {
    // @todo вынести в какой-нибудь валидатор
    if (!input.value || !input.date) {
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

    return newIncome;
  }

  /**
   * Изменяет фактический доход
   */
  async changeFact(updateIncomeFact: UpdateIncomeFactDto, user: User): Promise<void> {
    if (!updateIncomeFact.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const income = this.createIncome(updateIncomeFact, user.id);

    await this.incomeFactRepository.update(updateIncomeFact.id, income);
  }

  /**
   * Удаляет фактический расход
   */
  async deleteFact(id: number): Promise<void> {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    await this.incomeFactRepository.delete(id);
  }

  /**
   * Получает список планируемых доходов по дате
   */
  getAllPlansByPeriod(start: string, end: string): Promise<Income[]> {
    // @todo вынести в какой-нибудь валидатор
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.incomePlanRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      relations: ['category'],
    });
  }

  /**
   * Получает cумму планируемых доходов по дате
   */
  async getPlansSumByPeriod(start: string, end: string) {
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const items = await this.incomePlanRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      select: ['value'],
    });

    return items.reduce((acc, item) => acc + item.value, 0);
  }

  /**
   * Получает cумму фактических доходов по дате
   */
  async getFactsSumByPeriod(start: string, end: string) {
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const items = await this.incomeFactRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      select: ['value'],
    });

    return items.reduce((acc, item) => acc + item.value, 0);
  }

  /**
   * Получает спискок фактических доходов по дате
   */
  getAllFactsByPeriod(start: string, end: string): Promise<Income[]> {
    // @todo вынести в какой-нибудь валидатор
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.incomeFactRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      relations: ['category'],
    });
  }
}
