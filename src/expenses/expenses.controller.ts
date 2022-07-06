import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ExpensesService } from './expenses.service';
import { AddExpensePlanDto } from './dto/add-expense-plan-dto';
import { AddExpenseFactDto } from './dto/add-expense-fact-dto';
import { Expense } from './interfaces/expense.interfaces';
import { UpdateExpensePlanDto } from './dto/update-expense-plan.dto';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { UpdateExpenseFactDto } from './dto/update-expense-fact.dto';
import { GetAllExpensesOutputDto } from './dto/get-all-expenses-output-dto';

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
  @Put('/plan')
  @HttpCode(200)
  async updatePlan(@Body() updateExpensePlan: UpdateExpensePlanDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.expensesService.changePlan(updateExpensePlan, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/plan')
  @HttpCode(200)
  async removePlan(@Body() { id }: { id: number }): Promise<SuccessHandler> {
    try {
      await this.expensesService.deletePlan(id);

      return successHandler();
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
  @Put('/fact')
  @HttpCode(200)
  async updateFact(@Body() updateExpenseFact: UpdateExpenseFactDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.expensesService.changeFact(updateExpenseFact, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/fact')
  @HttpCode(200)
  async removeFact(@Body() { id }: { id: number }, @Request() req): Promise<SuccessHandler> {
    try {
      await this.expensesService.deleteFact(id, req.user);

      return successHandler();
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
  async getAllExpenses(@Query('start') start: string, @Query('end') end: string): Promise<GetAllExpensesOutputDto> {
    try {
      return {
        expenses: {
          plan: {
            list: await this.expensesService.getAllPlansByPeriod(start, end),
            sum: await this.expensesService.getPlansSumByPeriod(start, end),
          },
          fact: {
            list: await this.expensesService.getAllFactsByPeriod(start, end),
            sum: await this.expensesService.getFactsSumByPeriod(start, end),
          },
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
