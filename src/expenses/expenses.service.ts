import { HttpException, HttpStatus } from '@nestjs/common';
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');

export class ExpensesService {
  constructor(
    @InjectRepository(ExpensesPlan)
    private expensesPlanRepository: Repository<Expense>,

    @InjectRepository(ExpensesFact)
    private expensesFactRepository: Repository<Expense>
  ) {}

  /**
   * Создает расход
   */
  private createExpense(input: AddExpensePlanDto | AddExpenseFactDto, userId: number) {
    // @todo вынести в какой-нибудь валидатор
    if (!input.value || !input.date) {
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
   * Добавляет плановый расход
   */
  async addPlan(addExpensePlan: AddExpensePlanDto, user: User): Promise<Expense> {
    const expense = this.createExpense(addExpensePlan, user.id);

    const newExpense = await this.expensesPlanRepository.save(expense);
    delete newExpense.user;

    return newExpense;
  }

  /**
   * Добавляет фактический расход
   */
  async addFact(addExpenseFact: AddExpenseFactDto, user: User): Promise<Expense> {
    const expense = this.createExpense(addExpenseFact, user.id);

    const newExpense = await this.expensesFactRepository.save(expense);
    delete newExpense.user;

    return newExpense;
  }

  /**
   * Получает спискок планируемых трат по дате
   */
  getAllPlansByPeriod(start: string, end: string): Promise<Expense[]> {
    // @todo вынести в какой-нибудь валидатор
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.expensesPlanRepository.findBy({
      date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
    });
  }

  /**
   * Получает спискок фактических трат по дате
   */
  getAllFactsByPeriod(start: string, end: string): Promise<Expense[]> {
    // @todo вынести в какой-нибудь валидатор
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.expensesFactRepository.findBy({
      date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
    });
  }
}
