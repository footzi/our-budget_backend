import { Income } from '../interfaces/income.interface';

export class GetAllIncomesOutputDto {
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
