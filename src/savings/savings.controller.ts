import { Body, Controller, Delete, Get, HttpCode, Inject, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ErrorHandler } from '../utils/errorHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { AddSavingFactDto } from './dto/add-saving-fact.dto';
import { AddSavingGoalDto } from './dto/add-saving-goal.dto';
import { AddSavingPlanDto } from './dto/add-saving-plan.dto';
import { DeleteSavingGoalDto } from './dto/delete-saving-goal.dto';
import { DeleteSavingDto } from './dto/delete-saving.dto';
import { GetAllSavingsOutputDto } from './dto/get-all-savings-output.dto';
import { SavingGoalOutputDto } from './dto/saving-goal-output.dto';
import { SavingGoalsOutputDto } from './dto/saving-goals-output.dto';
import { SavingOutputDto } from './dto/saving-output.dto';
import { UpdateSavingFactDto } from './dto/update-saving-fact.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';
import { UpdateSavingPlanDto } from './dto/update-saving-plan.dto';
import { SavingsService } from './savings.service';

@Controller('/api/savings')
export class SavingsController {
  constructor(
    private readonly savingsService: SavingsService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/goal')
  @HttpCode(201)
  @ApiCreatedResponse({ type: SavingGoalOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async addGoal(@Body() addSavingGoal: AddSavingGoalDto, @Request() req): Promise<SavingGoalOutputDto> {
    try {
      return {
        savingGoal: await this.savingsService.addGoal(req.user.id, addSavingGoal),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/goal')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async updateGoal(@Body() updateSavingGoal: UpdateSavingGoalDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.updateGoal(req.user.id, updateSavingGoal);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/goal')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async deleteGoal(@Body() deleteSavingGoalDto: DeleteSavingGoalDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.deleteGoal(deleteSavingGoalDto.id);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/goal')
  @HttpCode(200)
  @ApiOkResponse({ type: SavingGoalsOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAllGoals(@Request() req): Promise<SavingGoalsOutputDto> {
    try {
      return {
        savingGoals: await this.savingsService.getAllGoals(req.user.id),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/plan')
  @HttpCode(200)
  @ApiOkResponse({ type: SavingOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async addPlan(@Body() addSavingPlan: AddSavingPlanDto, @Request() req): Promise<SavingOutputDto> {
    try {
      return {
        saving: await this.savingsService.addPlan(req.user.id, addSavingPlan),
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
  async updatePlan(@Body() updateSavingPlan: UpdateSavingPlanDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.updatePlan(req.user.id, updateSavingPlan);
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
  async deletePlan(@Body() deleteSavingDto: DeleteSavingDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.deletePlan(deleteSavingDto.id);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fact')
  @HttpCode(200)
  @ApiOkResponse({ type: SavingOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async addFact(@Body() addSavingFact: AddSavingFactDto, @Request() req): Promise<SavingOutputDto> {
    try {
      return {
        saving: await this.savingsService.addFact(req.user.id, addSavingFact),
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
  async updateFact(@Body() updateSavingFact: UpdateSavingFactDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.updateFact(req.user.id, updateSavingFact);
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
  async deleteFact(@Body() deleteSavingDto: DeleteSavingDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.deleteFact(req.user.id, deleteSavingDto.id);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAll')
  @HttpCode(200)
  @ApiOkResponse({ type: GetAllSavingsOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAllSavings(
    @Query('start') start: string,
    @Query('end') end: string,
    @Request() req
  ): Promise<GetAllSavingsOutputDto> {
    try {
      const plan = await this.savingsService.getAllPlansByPeriod(req.user.id, start, end);
      const fact = await this.savingsService.getAllFactsByPeriod(req.user.id, start, end);

      return {
        savings: {
          plan: {
            list: plan,
            sum: this.savingsService.calculateTotalSum(plan),
          },
          fact: {
            list: fact,
            sum: this.savingsService.calculateTotalSum(fact),
          },
        },
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }
}
