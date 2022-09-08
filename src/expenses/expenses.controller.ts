import { Body, Controller, Delete, Get, HttpCode, Inject, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ErrorHandler } from '../utils/errorHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { AddExpenseFactDto } from './dto/add-expense-fact.dto';
import { AddExpensePlanDto } from './dto/add-expense-plan.dto';
import { DeleteExpenseDto } from './dto/delete-expense.dto';
import { ExpenseOutputDto } from './dto/expense-output.dto';
import { ExpensesOutputDto } from './dto/expenses-output.dto';
import { GetAllExpensesOutputDto } from './dto/get-all-expenses-output.dto';
import { UpdateExpenseFactDto } from './dto/update-expense-fact.dto';
import { UpdateExpensePlanDto } from './dto/update-expense-plan.dto';
import { ExpensesService } from './expenses.service';

@Controller('/api/expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/plan')
  @HttpCode(201)
  @ApiCreatedResponse({ type: ExpenseOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async addPlan(@Body() addExpensePlan: AddExpensePlanDto, @Request() req): Promise<ExpenseOutputDto> {
    try {
      return {
        expense: await this.expensesService.addPlan(addExpensePlan, req.user),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/plan')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async updatePlan(@Body() updateExpensePlan: UpdateExpensePlanDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.expensesService.changePlan(updateExpensePlan, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/plan')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async removePlan(@Body() deleteExpenseDto: DeleteExpenseDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.expensesService.deletePlan(deleteExpenseDto.id);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fact')
  @HttpCode(201)
  @ApiCreatedResponse({ type: ExpenseOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async addFact(@Body() addExpenseFact: AddExpenseFactDto, @Request() req): Promise<ExpenseOutputDto> {
    try {
      return {
        expense: await this.expensesService.addFact(addExpenseFact, req.user),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/fact')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async updateFact(@Body() updateExpenseFact: UpdateExpenseFactDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.expensesService.changeFact(updateExpenseFact, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/fact')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async removeFact(@Body() deleteExpenseDto: DeleteExpenseDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.expensesService.deleteFact(deleteExpenseDto.id, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/plan/getAll')
  @HttpCode(200)
  @ApiOkResponse({ type: ExpensesOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAllPlansByPeriod(
    @Body('start') start: string,
    @Body('end') end: string,
    @Request() req
  ): Promise<ExpensesOutputDto> {
    try {
      return {
        expenses: await this.expensesService.getAllPlansByPeriod(start, end, req.user.id),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/fact/getAll')
  @HttpCode(200)
  @ApiOkResponse({ type: ExpensesOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAllFactsByPeriod(
    @Body('start') start: string,
    @Body('end') end: string,
    @Request() req
  ): Promise<ExpensesOutputDto> {
    try {
      return {
        expenses: await this.expensesService.getAllFactsByPeriod(start, end, req.user.id),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAll')
  @HttpCode(200)
  @ApiOkResponse({ type: GetAllExpensesOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAllExpenses(
    @Query('start') start: string,
    @Query('end') end: string,
    @Request() req
  ): Promise<GetAllExpensesOutputDto> {
    try {
      return {
        expenses: {
          plan: {
            list: await this.expensesService.getAllPlansByPeriod(start, end, req.user.id),
            sum: await this.expensesService.getPlansSumByPeriod(start, end, req.user.id),
          },
          fact: {
            list: await this.expensesService.getAllFactsByPeriod(start, end, req.user.id),
            sum: await this.expensesService.getFactsSumByPeriod(start, end, req.user.id),
          },
        },
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }
}
