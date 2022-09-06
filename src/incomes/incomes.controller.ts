import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ErrorHandler } from '../utils/errorHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { AddIncomeFactDto } from './dto/add-income-fact.dto';
import { AddIncomePlanDto } from './dto/add-income-plan.dto';
import { DeleteIncomeDto } from './dto/delete-income.dto';
import { GetAllIncomesOutputDto } from './dto/get-all-incomes-output.dto';
import { IncomeOutputDto } from './dto/income-output.dto';
import { IncomesOutputDto } from './dto/incomes-output.dto';
import { UpdateIncomeFactDto } from './dto/update-income-fact.dto';
import { UpdateIncomePlanDto } from './dto/update-income-plan.dto';
import { IncomesService } from './incomes.service';

@Controller('/api/incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/plan')
  @HttpCode(201)
  @ApiCreatedResponse({ type: IncomeOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async addPlan(@Body() addIncomePlan: AddIncomePlanDto, @Request() req): Promise<IncomeOutputDto> {
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
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
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
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async removePlan(@Body() deleteIncomeDto: DeleteIncomeDto): Promise<SuccessHandler> {
    try {
      await this.incomesService.deletePlan(deleteIncomeDto.id);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fact')
  @HttpCode(201)
  @ApiCreatedResponse({ type: IncomeOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async addFact(@Body() addIncomeFact: AddIncomeFactDto, @Request() req): Promise<IncomeOutputDto> {
    try {
      return {
        income: await this.incomesService.addFact(addIncomeFact, req.user),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/fact')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
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
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async removeFact(@Body() deleteIncomeDto: DeleteIncomeDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.incomesService.deleteFact(deleteIncomeDto.id, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/plan/getAll')
  @HttpCode(200)
  @ApiOkResponse({ type: IncomesOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAllPlansByPeriod(
    @Body('start') start: string,
    @Body('end') end: string,
    @Request() req
  ): Promise<IncomesOutputDto> {
    try {
      return {
        incomes: await this.incomesService.getAllPlansByPeriod(start, end, req.user.id),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/fact/getAll')
  @HttpCode(200)
  @ApiOkResponse({ type: IncomesOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAllFactsByPeriod(
    @Body('start') start: string,
    @Body('end') end: string,
    @Request() req
  ): Promise<IncomesOutputDto> {
    try {
      return {
        incomes: await this.incomesService.getAllFactsByPeriod(start, end, req.user.id),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAll')
  @HttpCode(200)
  @ApiOkResponse({ type: GetAllIncomesOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAllIncomes(
    @Query('start') start: string,
    @Query('end') end: string,
    @Request() req
  ): Promise<GetAllIncomesOutputDto> {
    try {
      return {
        incomes: {
          plan: {
            list: await this.incomesService.getAllPlansByPeriod(start, end, req.user.id),
            sum: await this.incomesService.getPlansSumByPeriod(start, end, req.user.id),
          },
          fact: {
            list: await this.incomesService.getAllFactsByPeriod(start, end, req.user.id),
            sum: await this.incomesService.getFactsSumByPeriod(start, end, req.user.id),
          },
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
