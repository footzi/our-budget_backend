import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { BalanceService } from '../balance/balance.service';
import { CurrenciesValues } from '../currencies/curerncies.interfaces';
import { DEFAULT_CURRENCY } from '../currencies/currencies.constants';
import { Date } from '../date/date.index';
import { Users } from '../users/entities/users.entity';
import { ValidatorService } from '../validator/validator.service';
import { AddSavingFactDto } from './dto/add-saving-fact.dto';
import { AddSavingGoalDto } from './dto/add-saving-goal.dto';
import { AddSavingPlanDto } from './dto/add-saving-plan.dto';
import { UpdateSavingFactDto } from './dto/update-saving-fact.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';
import { UpdateSavingPlanDto } from './dto/update-saving-plan.dto';
import { SavingsFact } from './entities/savings-fact.entity';
import { SavingsGoal } from './entities/savings-goal.entity';
import { SavingsPlan } from './entities/savings-plan.entity';
import { Saving, SavingGoal } from './interfaces/saving.interface';
import { SAVING_ACTION_TYPE } from './savings.constants';

export class SavingsService {
  constructor(
    @InjectRepository(SavingsGoal)
    private savingsGoalRepository: Repository<SavingGoal>,

    @InjectRepository(SavingsFact)
    private savingsFactRepository: Repository<Saving>,

    @InjectRepository(SavingsPlan)
    private savingsPlanRepository: Repository<Saving>,

    private balanceService: BalanceService,

    private validator: ValidatorService
  ) {}

  /**
   * Изменяет баланс при добавлении в копилку
   */
  private async changeBalanceAdd(userId: number, item: Saving) {
    this.validator.getIsRequiredFields(userId, item);

    const { value, actionType, currency } = item;

    const result = actionType === SAVING_ACTION_TYPE.INCOME ? -value : value;

    await this.balanceService.increment(userId, result, currency);
  }

  /**
   * Изменяет баланс при обновлении копилки
   */
  private async changeBalanceUpdate(userId: number, item: Saving, previousItem: Saving) {
    this.validator.getIsRequiredFields(userId, item, previousItem);

    const { actionType, value, currency } = item;

    const diff = previousItem.value - Number(value);
    const result = actionType === SAVING_ACTION_TYPE.INCOME ? diff : -diff;

    await this.balanceService.increment(userId, result, currency);
  }

  /**
   * Изменяет баланс при удалении копилки
   */
  private async changeBalanceDelete(userId: number, previousItem: Saving) {
    this.validator.getIsRequiredFields(userId, previousItem);

    const { actionType, value, currency } = previousItem;

    const result = actionType === SAVING_ACTION_TYPE.INCOME ? value : -value;
    await this.balanceService.increment(userId, result, currency);
  }

  /**
   * Создает цель
   */
  private createGoal(userId: number, input: AddSavingGoalDto | UpdateSavingGoalDto): SavingGoal {
    this.validator.getIsRequiredFields(userId, input?.name);

    const user = new Users();
    user.id = userId;

    return {
      name: input.name,
      currency: input.currency ?? DEFAULT_CURRENCY,
      description: input.description ?? '',
      finishValue: input.finishValue ?? null,
      value: input.value ?? 0,
      order: 0,
      user,
    };
  }

  /**
   * Создает элемент копилки
   */
  private async createSaving(userId: number, input: AddSavingPlanDto | UpdateSavingPlanDto): Promise<Saving> {
    this.validator.getIsRequiredFields(userId, input?.value, input?.date, input?.goalId);

    const goal = await this.getGoal(input.goalId);

    this.validator.getIsEqualCurrency(input.currency, goal.currency);

    const user = new Users();
    user.id = userId;

    return {
      value: Number(input.value),
      date: input.date,
      currency: input.currency ?? DEFAULT_CURRENCY,
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
    this.validator.getIsRequiredFields(goalId, item);

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
    this.validator.getIsRequiredFields(goalId, item, previousItem);

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
    this.validator.getIsRequiredFields(previousItem);

    const { actionType, value, goal } = previousItem;

    const saveValue = actionType === SAVING_ACTION_TYPE.INCOME ? goal.value - value : goal.value + value;

    await this.savingsGoalRepository.update(goal.id, { value: saveValue });
  }

  /**
   * Получает копилку
   */
  async getGoal(goalId): Promise<SavingGoal> {
    return this.savingsGoalRepository.findOneBy({ id: goalId });
  }

  /**
   * Добавляет копилку
   */
  async addGoal(userId: number, addSavingGoal: AddSavingGoalDto): Promise<SavingGoal> {
    this.validator.getIsRequiredFields(userId, addSavingGoal);

    const goal = this.createGoal(userId, addSavingGoal);

    const newGoal = await this.savingsGoalRepository.save(goal);
    delete newGoal.user;

    return newGoal;
  }

  /**
   * Обновляет копилку
   */
  async updateGoal(userId: number, updateSavingGoal: UpdateSavingGoalDto): Promise<void> {
    this.validator.getIsRequiredFields(userId, updateSavingGoal?.id);

    const oldGoal = await this.getGoal(updateSavingGoal.id);

    this.validator.getIsEqualCurrency(updateSavingGoal.currency, oldGoal.currency);

    await this.savingsGoalRepository.update(updateSavingGoal.id, updateSavingGoal);
  }

  /**
   * Удаляет копилку
   */
  async deleteGoal(id: number) {
    this.validator.getIsRequiredFields(id);

    const facts = await this.getFactsByGoalId(id);
    const plans = await this.getPlansByGoalId(id);
    const isNotEmpty = facts.length > 0 || plans.length > 0;

    if (isNotEmpty) {
      throw new HttpException(
        'Не возможно удалить копилку, если есть значениях в Планах или Фактах',
        HttpStatus.BAD_REQUEST
      );
    }

    await this.savingsGoalRepository.delete(id);
  }

  /**
   * Возвращает весь список копилок
   */
  async getAllGoals(userId: number): Promise<SavingGoal[]> {
    this.validator.getIsRequiredFields(userId);

    return this.savingsGoalRepository.find({
      where: {
        user: {
          id: userId,
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
  async addPlan(userId: number, addSavingPlan: AddSavingPlanDto): Promise<Saving> {
    this.validator.getIsRequiredFields(userId, addSavingPlan);

    const plan = await this.createSaving(userId, addSavingPlan);

    const item = await this.savingsPlanRepository.save(plan);
    delete item.user;

    return item;
  }

  /**
   * Обновляет план
   */
  async updatePlan(userId: number, updateSavingPlan: UpdateSavingPlanDto): Promise<void> {
    this.validator.getIsRequiredFields(userId, updateSavingPlan?.id);

    const item = await this.createSaving(userId, updateSavingPlan);

    await this.savingsPlanRepository.update(updateSavingPlan.id, item);
  }

  /**
   * Удаляет план
   */
  async deletePlan(id: number) {
    this.validator.getIsRequiredFields(id);

    await this.savingsPlanRepository.delete(id);
  }

  /**
   * Создает факт
   */
  async addFact(userId: number, addSavingFact: AddSavingFactDto): Promise<Saving> {
    this.validator.getIsRequiredFields(userId, addSavingFact);

    const fact = await this.createSaving(userId, addSavingFact);
    const item = await this.savingsFactRepository.save(fact);
    delete item.user;

    await this.changeAddValueGoal(addSavingFact.goalId, item);
    await this.changeBalanceAdd(userId, item);

    return item;
  }

  /**
   * Обновляет факт
   */
  async updateFact(userId: number, updateSavingFact: UpdateSavingFactDto): Promise<void> {
    this.validator.getIsRequiredFields(userId, updateSavingFact?.id);

    const item = await this.createSaving(userId, updateSavingFact);
    const previousItem = await this.savingsFactRepository.findOne({
      where: { id: updateSavingFact.id },
    });

    this.validator.getIsEqualActionSavingTypes(item.actionType, previousItem.actionType);
    this.validator.getIsEqualCurrency(item.currency, previousItem.currency);

    await this.savingsFactRepository.update(updateSavingFact.id, item);
    await this.changeUpdateValueGoal(updateSavingFact.goalId, item, previousItem);
    await this.changeBalanceUpdate(userId, item, previousItem);
  }

  /**
   * Удаляет факт
   */
  async deleteFact(userId: number, id: number) {
    this.validator.getIsRequiredFields(userId, id);

    const previousItem = await this.savingsFactRepository.findOne({
      where: { id },
      relations: ['goal'],
    });

    await this.savingsFactRepository.delete(id);
    await this.changeDeleteValueGoal(previousItem);
    await this.changeBalanceDelete(userId, previousItem);
  }

  /**
   * Получает список плана по дате
   */
  getAllPlansByPeriod(userId: number, start: string, end: string): Promise<Saving[]> {
    this.validator.getIsRequiredFields(userId, start, end);

    return this.savingsPlanRepository.find({
      where: {
        date: Between(Date.toFormat(start), Date.toFormat(end)),
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['goal'],
    });
  }

  /**
   * Получает список факта по дате
   */
  getAllFactsByPeriod(userId: number, start: string, end: string): Promise<Saving[]> {
    this.validator.getIsRequiredFields(userId, start, end);

    return this.savingsFactRepository.find({
      where: {
        date: Between(Date.toFormat(start), Date.toFormat(end)),
        user: {
          id: userId,
        },
      },
      order: {
        date: 'DESC',
      },
      relations: ['goal'],
    });
  }

  /**
   * Возвращает общую сумму по записям в разрезе валют
   */
  calculateTotalSum(items: Saving[]): CurrenciesValues {
    return items.reduce(
      (acc, item) => {
        const { value, actionType, currency } = item;

        if (actionType === SAVING_ACTION_TYPE.INCOME) {
          acc[currency] = acc[currency] !== undefined ? acc[currency] + value : value;
        } else {
          acc[currency] = acc[currency] !== undefined ? acc[currency] - value : -value;
        }

        return acc;
      },
      { [DEFAULT_CURRENCY]: 0 }
    );
  }

  /**
   * Получение фактов по id копилки
   */
  getFactsByGoalId(goalId: number) {
    this.validator.getIsRequiredFields(goalId);

    return this.savingsFactRepository.find({
      where: {
        goal: {
          id: goalId,
        },
      },
    });
  }

  /**
   * Получение планов по id копилки
   */
  getPlansByGoalId(goalId: number) {
    this.validator.getIsRequiredFields(goalId);

    return this.savingsPlanRepository.find({
      where: {
        goal: {
          id: goalId,
        },
      },
    });
  }
}
