import { Income } from '../interfaces/income.interface';

export interface GetAllIncomesOutputDto {
  incomes: {
    plan: {
      list: Income[];
      sum: number;
    };
    fact: {
      list: Income[];
      sum: number;
    };
  };
}
