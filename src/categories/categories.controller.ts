import { Body, Controller, HttpCode, Post, UseGuards, Request, Get, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { AddCategoryDto } from './dto/add-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/categories.inteface';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { successHandler } from '../utils/successHandler';
import { SuccessHandler } from '../utils/successHandler/interfaces';

@Controller('/api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async add(@Body() addCategoryDto: AddCategoryDto, @Request() req): Promise<{ category: Category }> {
    try {
      return {
        category: await this.categoriesService.add(addCategoryDto, req.user),
      };
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(200)
  async update(@Body() updateCategoryDto: UpdateCategoryDto, @Request() req): Promise<SuccessHandler> {
    try {
      await this.categoriesService.update(updateCategoryDto, req.user);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(200)
  async delete(@Body() { id }: { id: number }): Promise<SuccessHandler> {
    try {
      await this.categoriesService.delete(id);

      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  @HttpCode(200)
  async getAll(@Request() req): Promise<{ categories: Category[] }> {
    try {
      return {
        categories: await this.categoriesService.getAll(req.user),
      };
    } catch (error) {
      errorHandler(error);
    }
  }
}
