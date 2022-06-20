import { Categories } from './entities/categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCategoryDto } from './dto/add-category.dto';
import { User } from '../users/interfaces/users.interface';
import { Category } from './interfaces/categories.inteface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Users } from '../users/entities/users.entity';

export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private ordersRepository: Repository<Categories>
  ) {}

  /**
   * Создает новую категорию
   */
  async add(addCategoryDto: AddCategoryDto, user: User): Promise<Category> {
    // @todo вынести в какой-нибудь валидатор
    if (!addCategoryDto.name) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const savedUser = new Users();
    savedUser.id = user.id;

    const category: Category = {
      name: addCategoryDto.name,
      isAdditional: addCategoryDto.isAdditional ?? false,
      user: savedUser,
    };

    const newCategory = await this.ordersRepository.save(category);
    delete newCategory.user;

    return newCategory;
  }

  /**
   * Получает список всех категорий для пользователя
   */
  async getAll(user: User): Promise<Category[]> {
    return this.ordersRepository.findBy({
      user: {
        id: user.id,
      },
    });
  }
}
