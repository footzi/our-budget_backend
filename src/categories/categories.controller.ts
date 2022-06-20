import { Body, Controller, HttpCode, Post, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorHandler } from '../utils/errorHandler';
import { AddCategoryDto } from './dto/add-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/categories.inteface';

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
