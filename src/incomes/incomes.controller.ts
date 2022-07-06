import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { IncomesService } from './incomes.service';
import { AddIncomePlanDto } from './dto/add-income-dto-plan';
import { AddIncomeFactDto } from './dto/add-income-dto-fact';
import { Income } from './interfaces/income.interface';
import { UpdateIncomePlanDto } from './dto/update-income-plan.dto';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { UpdateIncomeFactDto } from './dto/update-income-fact.dto';
import { GetAllIncomesOutputDto } from './dto/get-all-incomes-output-dto';

@Controller('/api/incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/plan')
  @HttpCode(201)
  async addPlan(@Body() addIncomePlan: AddIncomePlanDto, @Request() req): Promise<{ income: Income }> {
    try {
      return {
        income: await this.incomesService.addPlan(addIncomePlan, req.user),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/plan')
  @HttpCode(200)
  async updatePlan(@Body() updateIncomePlan: UpdateIncomePlanDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.incomesService.changePlan(updateIncomePlan, req.user);

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
      await this.incomesService.deletePlan(id);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fact')
  @HttpCode(201)
  async addFact(@Body() addIncomeFact: AddIncomeFactDto, @Request() req): Promise<{ incomes: Income }> {
    try {
      return {
        incomes: await this.incomesService.addFact(addIncomeFact, req.user),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/fact')
  @HttpCode(200)
  async updateFact(@Body() updateIncomeFact: UpdateIncomeFactDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.incomesService.changeFact(updateIncomeFact, req.user);

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
      await this.incomesService.deleteFact(id, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/plan/getAll')
  @HttpCode(200)
  async getAllPlansByPeriod(@Body('start') start: string, @Body('end') end: string): Promise<{ incomes: Income[] }> {
    try {
      return {
        incomes: await this.incomesService.getAllPlansByPeriod(start, end),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/fact/getAll')
  @HttpCode(200)
  async getAllFactsByPeriod(@Body('start') start: string, @Body('end') end: string): Promise<{ incomes: Income[] }> {
    try {
      return {
        incomes: await this.incomesService.getAllFactsByPeriod(start, end),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAll')
  @HttpCode(200)
  async getAllIncomes(@Query('start') start: string, @Query('end') end: string): Promise<GetAllIncomesOutputDto> {
    try {
      return {
        incomes: {
          plan: {
            list: await this.incomesService.getAllPlansByPeriod(start, end),
            sum: await this.incomesService.getPlansSumByPeriod(start, end),
          },
          fact: {
            list: await this.incomesService.getAllFactsByPeriod(start, end),
            sum: await this.incomesService.getFactsSumByPeriod(start, end),
          },
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
