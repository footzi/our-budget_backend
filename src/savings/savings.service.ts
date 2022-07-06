import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SavingsGoal } from './entities/savings-goal.entity';
import { Saving, SavingGoal } from './interfaces/saving.interfaces';
import { SavingsFact } from './entities/savings-fact.entity';
import { AddSavingGoalDto } from './dto/add-saving-goal-dto';
import { User } from '../users/interfaces/users.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Users } from '../users/entities/users.entity';
import { UpdateSavingGoalDto } from './dto/update-saving-goal-dto';
import { AddSavingPlanDto } from './dto/add-saving-plan-dto';
import { UpdateSavingPlanDto } from './dto/update-saving-plan-dto';
import { AddSavingFactDto } from './dto/add-saving-fact-dto';
import { UpdateSavingFactDto } from './dto/update-saving-fact-dto';
import { SavingsPlan } from './entities/savings-plan.entity';
import { SAVING_ACTION_TYPE } from './savings.constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');

export class SavingsService {
  constructor(
    @InjectRepository(SavingsGoal)
    private savingsGoalRepository: Repository<SavingGoal>,

    @InjectRepository(SavingsFact)
    private savingsFactRepository: Repository<Saving>,

    @InjectRepository(SavingsPlan)
    private savingsPlanRepository: Repository<Saving>
  ) {}

  /**
   * Создает цель
   */
  private createGoal(input: AddSavingGoalDto | UpdateSavingGoalDto, userId): SavingGoal {
    if (!input.name) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const user = new Users();
    user.id = userId;

    return {
      name: input.name,
      description: input.description ?? '',
      finishValue: input.finishValue ?? null,
      value: input.value ?? 0,
      user,
    };
  }

  /**
   * Создает элемент копилки
   */
  private createSaving(input: AddSavingPlanDto | UpdateSavingPlanDto, userId: number): Saving {
    if (!input.value || !input.date || !input.goalId) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const goal = new SavingsGoal();
    goal.id = input.goalId;

    const user = new Users();
    user.id = userId;

    return {
      value: Number(input.value),
      date: input.date,
      comment: input.comment ?? '',
      actionType: input.actionType,
      goal,
      user,
    };
  }

  /**
   * Обновляет значение копилки при добавлении
   */
  private async changeAddValueGoal(goalId: number, item: Saving) {
    const { actionType, value } = item;

    const currentGoal = await this.savingsGoalRepository.findOne({
      where: { id: goalId },
    });
    const currentValue = currentGoal.value;
    const saveValue =
      actionType === SAVING_ACTION_TYPE.INCOME ? currentValue + Number(value) : currentValue - Number(value);

    await this.savingsGoalRepository.update(goalId, { value: saveValue });
  }

  /**
   * Обновляет значение копилки при обновлении
   */
  private async changeUpdateValueGoal(goalId: number, item: Saving, previousItem: Saving) {
    const { actionType, value } = item;

    const currentGoal = await this.savingsGoalRepository.findOne({
      where: { id: goalId },
    });

    const diff = previousItem.value - Number(value);

    const currentValue = currentGoal.value;
    const saveValue = actionType === SAVING_ACTION_TYPE.INCOME ? currentValue - diff : currentValue + diff;

    await this.savingsGoalRepository.update(goalId, { value: saveValue });
  }

  /**
   * Обновляет значение копилки при удалении
   */
  private async changeDeleteValueGoal(previousItem: Saving) {
    const { actionType, value, goal } = previousItem;

    const saveValue = actionType === SAVING_ACTION_TYPE.INCOME ? goal.value - value : goal.value + value;

    await this.savingsGoalRepository.update(goal.id, { value: saveValue });
  }

  /**
   * Добавляет копилку
   */
  async addGoal(addSavingGoal: AddSavingGoalDto, user: User): Promise<SavingGoal> {
    const goal = this.createGoal(addSavingGoal, user.id);

    const newGoal = await this.savingsGoalRepository.save(goal);
    delete newGoal.user;

    return newGoal;
  }

  /**
   * Обновляет копилку
   */
  async updateGoal(updateSavingGoal: UpdateSavingGoalDto, user: User): Promise<void> {
    if (!updateSavingGoal.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const goal = this.createGoal(updateSavingGoal, user.id);

    await this.savingsGoalRepository.update(updateSavingGoal.id, goal);
  }

  /**
   * Удаляет копилку
   */
  async deleteGoal(id: number) {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    await this.savingsGoalRepository.delete(id);
  }

  /**
   * Возвращает весь список копилок
   */
  async getAllGoals(user: User): Promise<SavingGoal[]> {
    return this.savingsGoalRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  /**
   * Создает план
   */
  async addPlan(addSavingPlan: AddSavingPlanDto, user: User): Promise<Saving> {
    const plan = this.createSaving(addSavingPlan, user.id);

    const item = await this.savingsPlanRepository.save(plan);
    delete item.user;

    return item;
  }

  /**
   * Обновляет план
   */
  async updatePlan(updateSavingPlan: UpdateSavingPlanDto, user: User): Promise<void> {
    if (!updateSavingPlan.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const item = this.createSaving(updateSavingPlan, user.id);

    await this.savingsPlanRepository.update(updateSavingPlan.id, item);
  }

  /**
   * Удаляет план
   */
  async deletePlan(id: number) {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    await this.savingsPlanRepository.delete(id);
  }

  /**
   * Создает факт
   */
  async addFact(addSavingFact: AddSavingFactDto, user: User): Promise<Saving> {
    const fact = this.createSaving(addSavingFact, user.id);

    const item = await this.savingsFactRepository.save(fact);
    delete item.user;

    await this.changeAddValueGoal(addSavingFact.goalId, item);

    return item;
  }

  /**
   * Обновляет факт
   */
  async updateFact(updateSavingFact: UpdateSavingFactDto, user: User): Promise<void> {
    if (!updateSavingFact.id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const item = this.createSaving(updateSavingFact, user.id);
    const previousItem = await this.savingsFactRepository.findOne({
      where: { id: updateSavingFact.id },
    });

    await this.savingsFactRepository.update(updateSavingFact.id, item);
    await this.changeUpdateValueGoal(updateSavingFact.goalId, item, previousItem);
  }

  /**
   * Удаляет факт
   */
  async deleteFact(id: number) {
    if (!id) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const previousItem = await this.savingsFactRepository.findOne({
      where: { id },
      relations: ['goal'],
    });

    await this.savingsFactRepository.delete(id);
    await this.changeDeleteValueGoal(previousItem);
  }

  /**
   * Получает список плана по дате
   */
  getAllPlansByPeriod(start: string, end: string): Promise<Saving[]> {
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.savingsPlanRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['goal'],
    });
  }

  /**
   * Получает список факта по дате
   */
  getAllFactsByPeriod(start: string, end: string): Promise<Saving[]> {
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    return this.savingsFactRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['goal'],
    });
  }

  /**
   * Получает cумму доходов по дате
   */
  async getPlansSumByPeriod(start: string, end: string) {
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const items = await this.savingsPlanRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      select: ['value'],
    });

    return items.reduce((acc, item) => acc + item.value, 0);
  }

  /**
   * Получает cумму доходов по дате
   */
  async getFactsSumByPeriod(start: string, end: string) {
    if (!start || !end) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    const items = await this.savingsFactRepository.find({
      where: {
        date: Between(dayjs(start).toISOString(), dayjs(end).toISOString()),
      },
      select: ['value'],
    });

    return items.reduce((acc, item) => acc + item.value, 0);
  }
}
