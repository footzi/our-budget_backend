import { Body, Controller, Delete, Get, HttpCode, Inject, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { ErrorHandler } from '../utils/errorHandler/interfaces';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';
import { CategoriesService } from './categories.service';
import { AddCategoryOutputDto } from './dto/add-category-output.dto';
import { AddCategoryDto } from './dto/add-category.dto';
import { AllCategoriesOutputDto } from './dto/all-categories-output.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/categories.interface';

@Controller('/api/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({ type: AddCategoryOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async add(@Body() addCategoryDto: AddCategoryDto, @Request() req): Promise<{ category: Category }> {
    try {
      return {
        category: await this.categoriesService.add(addCategoryDto, req.user),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async update(@Body() updateCategoryDto: UpdateCategoryDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.categoriesService.update(updateCategoryDto, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(200)
  @ApiOkResponse({ type: SuccessHandler })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async delete(@Body() deleteCategoryDto: DeleteCategoryDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.categoriesService.delete(deleteCategoryDto.id);

      return successHandler();
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  @HttpCode(200)
  @ApiOkResponse({ type: AllCategoriesOutputDto })
  @ApiBadRequestResponse({ type: ErrorHandler })
  async getAll(@Request() req): Promise<{ categories: Category[] }> {
    try {
      return {
        categories: await this.categoriesService.getAll(req.user),
      };
    } catch (error) {
      errorHandler(error, this.logger, req);
    }
  }
}
