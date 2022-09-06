import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../users/entities/users.entity';
import { User } from '../users/interfaces/users.interface';
import { AddCategoryDto } from './dto/add-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories } from './entities/categories.entity';
import { Category } from './interfaces/categories.interface';

export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>
  ) {}

  /**
   * Создает категорию
   */
  public createCategory(input: AddCategoryDto | UpdateCategoryDto, userId): Category {
    // @todo вынести в какой-нибудь валидатор
    if (!input.name) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const savedUser = new Users();
    savedUser.id = userId;

    return {
      name: input.name,
      type: input.type,
      startDate: input.startDate,
      endDate: input.endDate,
      user: savedUser,
    };
  }

  /**
   * Создает новую категорию
   */
  async add(addCategoryDto: AddCategoryDto, user: User): Promise<Category> {
    const category = this.createCategory(addCategoryDto, user.id);

    const newCategory = await this.categoriesRepository.save(category);
    delete newCategory.user;

    return newCategory;
  }

  /**
   * Обновляет категорию
   */
  async update(updateCategoryDto: UpdateCategoryDto, user: User): Promise<void> {
    if (!updateCategoryDto.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const category = this.createCategory(updateCategoryDto, user.id);

    await this.categoriesRepository.update(updateCategoryDto.id, category);
  }

  /**
   * Удаляет категорию
   */
  async delete(id: number) {
    // todo может нужна проверка на что пользователь не может удалить не свою категорию?? и вообще на все подонбые операции
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    await this.categoriesRepository.delete(id);
  }

  /**
   * Получает список всех категорий для пользователя
   */
  async getAll(user: User): Promise<Category[]> {
    return this.categoriesRepository.findBy({
      user: {
        id: user.id,
      },
    });
  }
}
