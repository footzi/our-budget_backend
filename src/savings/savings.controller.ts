import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

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
  constructor(private readonly savingsService: SavingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/goal')
  @HttpCode(201)
  @ApiCreatedResponse({ type: SavingGoalOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async addGoal(@Body() addSavingGoal: AddSavingGoalDto, @Request() req): Promise<SavingGoalOutputDto> {
    try {
      return {
        savingGoal: await this.savingsService.addGoal(addSavingGoal, req.user),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/goal')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async updateGoal(@Body() updateSavingGoal: UpdateSavingGoalDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.updateGoal(updateSavingGoal, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/goal')
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async deleteGoal(@Body() deleteSavingGoalDto: DeleteSavingGoalDto): Promise<SuccessHandler> {
    try {
      await this.savingsService.deleteGoal(deleteSavingGoalDto.id);

      return successHandler();
    } catch (error) {
      errorHandler(error);
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
        savingGoals: await this.savingsService.getAllGoals(req.user),
      };
    } catch (error) {
      errorHandler(error);
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
        saving: await this.savingsService.addPlan(addSavingPlan, req.user),
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
  async updatePlan(@Body() updateSavingPlan: UpdateSavingPlanDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.updatePlan(updateSavingPlan, req.user);
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
  async deletePlan(@Body() deleteSavingDto: DeleteSavingDto): Promise<SuccessHandler> {
    try {
      await this.savingsService.deletePlan(deleteSavingDto.id);

      return successHandler();
    } catch (error) {
      errorHandler(error);
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
        saving: await this.savingsService.addFact(addSavingFact, req.user),
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
  async updateFact(@Body() updateSavingFact: UpdateSavingFactDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.updateFact(updateSavingFact, req.user);
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
  async deleteFact(@Body() deleteSavingDto: DeleteSavingDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.savingsService.deleteFact(deleteSavingDto.id, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
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
      return {
        savings: {
          plan: {
            list: await this.savingsService.getAllPlansByPeriod(start, end, req.user.id),
            sum: await this.savingsService.getPlansSumByPeriod(start, end, req.user.id),
          },
          fact: {
            list: await this.savingsService.getAllFactsByPeriod(start, end, req.user.id),
            sum: await this.savingsService.getFactsSumByPeriod(start, end, req.user.id),
          },
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
