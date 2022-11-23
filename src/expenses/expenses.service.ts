import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { BalanceService } from '../balance/balance.service';
import { Categories } from '../categories/entities/categories.entity';
import { CurrenciesValues } from '../currencies/curerncies.interfaces';
import { DEFAULT_CURRENCY } from '../currencies/currencies.constants';
import { Date } from '../date/date.index';
import { Income } from '../incomes/interfaces/income.interface';
import { Users } from '../users/entities/users.entity';
import { User } from '../users/interfaces/users.interface';
import { ValidatorService } from '../validator/validator.service';
import { AddExpenseFactDto } from './dto/add-expense-fact.dto';
import { AddExpensePlanDto } from './dto/add-expense-plan.dto';
import { UpdateExpenseFactDto } from './dto/update-expense-fact.dto';
import { UpdateExpensePlanDto } from './dto/update-expense-plan.dto';
import { ExpensesFact } from './entities/expenses-fact.entity';
import { ExpensesPlan } from './entities/expenses-plan.entity';
import { Expense } from './interfaces/expense.interface';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpensesPlan)
    private expensesPlanRepository: Repository<Expense>,

    @InjectRepository(ExpensesFact)
    private expensesFactRepository: Repository<Expense>,

    private balanceService: BalanceService,

    private readonly validator: ValidatorService
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
      currency: input.currency,
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
    const { currency } = fact;
    const value = -fact.value;
    await this.balanceService.increment(userId, value, currency);
  }

  /**
   * Изменяет баланс при обновлении факта
   */
  private async changeBalanceUpdate(userId: number, fact: Income, previousFact: Income) {
    const { currency } = fact;
    const value = previousFact.value - Number(fact.value);
    await this.balanceService.increment(userId, value, currency);
  }

  /**
   * Изменяет баланс при удалении факта
   */
  private async changeBalanceDelete(userId: number, previousItem: Income) {
    const { currency } = previousItem;
    const value = previousItem.value;
    await this.balanceService.increment(userId, value, currency);
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
  getAllPlansByPeriod(userId: number, start: string, end: string): Promise<Expense[]> {
    this.validator.getIsRequiredFields(userId, start, end);

    return this.expensesPlanRepository.find({
      where: {
        user: {
          id: userId,
        },
        date: Between(Date.toFormat(start), Date.toFormat(end)),
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['category'],
    });
  }

  /**
   * Получает список фактических трат по дате
   */
  getAllFactsByPeriod(userId: number, start: string, end: string): Promise<Expense[]> {
    this.validator.getIsRequiredFields(userId, start, end);

    return this.expensesFactRepository.find({
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
  calculateTotalSum(items: Expense[]): CurrenciesValues {
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
    return this.expensesFactRepository.find({
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
    return this.expensesPlanRepository.find({
      where: {
        category: {
          id: categoryId,
        },
      },
    });
  }
}
