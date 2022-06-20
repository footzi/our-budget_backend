import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ExpensesService } from './expenses.service';
import { AddExpensePlanDto } from './dto/add-expense-plan-dto';
import { AddExpenseFactDto } from './dto/add-expense-fact-dto';
import { Expense } from './interfaces/expense.interfaces';

@Controller('/api/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/plan')
  @HttpCode(201)
  async addPlan(@Body() addExpensePlan: AddExpensePlanDto, @Request() req): Promise<{ expense: Expense }> {
    try {
      return {
        expense: await this.expensesService.addPlan(addExpensePlan, req.user),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fact')
  @HttpCode(201)
  async addFact(@Body() addExpenseFact: AddExpenseFactDto, @Request() req): Promise<{ expense: Expense }> {
    try {
      return {
        expense: await this.expensesService.addFact(addExpenseFact, req.user),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/plan/getAll')
  @HttpCode(200)
  async getAllPlansByPeriod(@Body('start') start: string, @Body('end') end: string): Promise<{ expenses: Expense[] }> {
    try {
      return {
        expenses: await this.expensesService.getAllPlansByPeriod(start, end),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/fact/getAll')
  @HttpCode(200)
  async getAllFactsByPeriod(@Body('start') start: string, @Body('end') end: string): Promise<{ expenses: Expense[] }> {
    try {
      return {
        expenses: await this.expensesService.getAllFactsByPeriod(start, end),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAll')
  @HttpCode(200)
  async getAllExpenses(
    @Body('start') start: string,
    @Body('end') end: string
  ): Promise<{ expenses: { fact: Expense[]; plan: Expense[] } }> {
    try {
      return {
        expenses: {
          plan: await this.expensesService.getAllPlansByPeriod(start, end),
          fact: await this.expensesService.getAllFactsByPeriod(start, end),
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
