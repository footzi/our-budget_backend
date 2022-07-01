import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { AddSavingGoalDto } from './dto/add-saving-goal-dto';
import { Saving, SavingGoal } from './interfaces/saving.interfaces';
import { UpdateSavingGoalDto } from './dto/update-saving-goal-dto';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { AddSavingPlanDto } from './dto/add-saving-plan-dto';
import { UpdateSavingPlanDto } from './dto/update-saving-plan-dto';
import { AddSavingFactDto } from './dto/add-saving-fact-dto';
import { UpdateSavingFactDto } from './dto/update-saving-fact-dto';
import { GetAllSavingsOutputDto } from './dto/get-all-savings-output-dto';

@Controller('/api/savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/goal')
  @HttpCode(201)
  async addGoal(@Body() addSavingGoal: AddSavingGoalDto, @Request() req): Promise<{ savingGoal: SavingGoal }> {
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
  async deleteGoal(@Body() { id }: { id: number }): Promise<SuccessHandler> {
    try {
      await this.savingsService.deleteGoal(id);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/goal')
  @HttpCode(200)
  async getAllGoals(@Request() req): Promise<{ savingGoals: SavingGoal[] }> {
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
  async addPlan(@Body() addSavingPlan: AddSavingPlanDto, @Request() req): Promise<{ saving: Saving }> {
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
  async deletePlan(@Body() { id }: { id: number }): Promise<SuccessHandler> {
    try {
      await this.savingsService.deletePlan(id);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/fact')
  @HttpCode(200)
  async addFact(@Body() addSavingFact: AddSavingFactDto, @Request() req): Promise<{ saving: Saving }> {
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
  async deleteFacr(@Body() { id }: { id: number }): Promise<SuccessHandler> {
    try {
      await this.savingsService.deleteFact(id);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getAll')
  @HttpCode(200)
  async getAllSavings(@Query('start') start: string, @Query('end') end: string): Promise<GetAllSavingsOutputDto> {
    try {
      return {
        saving: {
          plan: await this.savingsService.getAllPlansByPeriod(start, end),
          fact: await this.savingsService.getAllFactsByPeriod(start, end),
        },
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
