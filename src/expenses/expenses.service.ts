import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ExpensesPlan } from './entities/expenses-plan.entity';
import { Expense } from './interfaces/expense.interfaces';
import { User } from '../users/interfaces/users.interface';
import { AddExpensePlanDto } from './dto/add-expense-plan-dto';
import { Categories } from '../categories/entities/categories.entity';
import { Users } from '../users/entities/users.entity';
import { AddExpenseFactDto } from './dto/add-expense-fact-dto';
import { ExpensesFact } from './entities/expenses-fact.entity';
import { UpdateExpensePlanDto } from './dto/update-expense-plan.dto';
import { UpdateExpenseFactDto } from './dto/update-expense-fact.dto';
import { Income } from '../incomes/interfaces/income.interface';
import { BalanceService } from '../balance/balance.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpensesPlan)
    private expensesPlanRepository: Repository<Expense>,

    @InjectRepository(ExpensesFact)
    private expensesFactRepository: Repository<Expense>,

    private balanceService: BalanceService
  ) {}

  /**
   * Создает расход
   */
  private createExpense(
    input: AddExpensePlanDto | AddExpenseFactDto | UpdateExpensePlanDto | UpdateExpenseFactDto,
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

    const expense: Expense = {
      value: input.value,
      date: input.date,
      comment: input.comment ?? '',
      category: category,
      user: savedUser,
    };

    return expense;
  }

  /**
   * Изменяет баланс при добавлении факта
   */
  private async changeBalanceAdd(userId: number, fact: Income) {
    const value = -fact.value;
    await this.balanceService.changeBalance(userId, value);
  }

  /**
   * Изменяет баланс при обновлении факта
   */
  private async changeBalanceUpdate(userId: number, fact: Income, previousFact: Income) {
    const value = previousFact.value - Number(fact.value);
    await this.balanceService.changeBalance(userId, value);
  }

  /**
   * Изменяет баланс при удалении факта
   */
  private async changeBalanceDelete(userId: number, previousItem: Income) {
    const value = previousItem.value;
    await this.balanceService.changeBalance(userId, value);
  }

  /**
   * Добавляет плановый расход
   */
  async addPlan(addExpensePlan: AddExpensePlanDto, user: User): Promise<Expense> {
    const expense = this.createExpense(addExpensePlan, user.id);

    const newExpense = await this.expensesPlanRepository.save(expense);
    delete newExpense.user;

    return newExpense;
  }

  /**
   * Изменяет плановый расход
   */
  async changePlan(updateExpensePlan: UpdateExpensePlanDto, user: User): Promise<void> {
    if (!updateExpensePlan.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const expense = this.createExpense(updateExpensePlan, user.id);

    await this.expensesPlanRepository.update(updateExpensePlan.id, expense);
  }

  /**
   * Удаляет плановый расход
   */
  async deletePlan(id: number): Promise<void> {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    await this.expensesPlanRepository.delete(id);
  }

  /**
   * Добавляет фактический расход
   */
  async addFact(addExpenseFact: AddExpenseFactDto, user: User): Promise<Expense> {
    const expense = this.createExpense(addExpenseFact, user.id);

    const newExpense = await this.expensesFactRepository.save(expense);
    delete newExpense.user;

    await this.changeBalanceAdd(user.id, expense);

    return newExpense;
  }

  /**
   * Изменяет фактический расход
   */
  async changeFact(updateExpenseFact: UpdateExpenseFactDto, user: User): Promise<void> {
    if (!updateExpenseFact.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const previousFact = await this.expensesFactRepository.findOne({
      where: { id: updateExpenseFact.id },
    });

    const expense = this.createExpense(updateExpenseFact, user.id);

    await this.expensesFactRepository.update(updateExpenseFact.id, expense);
    await this.changeBalanceUpdate(user.id, expense, previousFact);
  }

  /**
   * Удаляет фактический расход
   */
  async deleteFact(id: number, user: User): Promise<void> {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const previousItem = await this.expensesFactRepository.findOne({
      where: { id },
    });

    await this.expensesFactRepository.delete(id);
    await this.changeBalanceDelete(user.id, previousItem);
  }

  /**
   * Получает список планируемых трат по дате
   */
  getAllPlansByPeriod(start: string, end: string): Promise<Expense[]> {
    // @todo вынести в какой-нибудь валидатор
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.expensesPlanRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      order: {
        createdAt: 'ASC',
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

    const items = await this.expensesPlanRepository.find({
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

    const items = await this.expensesFactRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      select: ['value'],
    });

    return items.reduce((acc, item) => acc + item.value, 0);
  }

  /**
   * Получает спискок фактических трат по дате
   */
  getAllFactsByPeriod(start: string, end: string): Promise<Expense[]> {
    // @todo вынести в какой-нибудь валидатор
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.expensesFactRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['category'],
    });
  }
}
