import { CurrenciesValues } from '../../currencies/curerncies.interfaces';
import { Income } from '../interfaces/income.interface';

export class GetAllIncomesOutputDto {
  incomes: {
    plan: {
      list: Income[];
      sum: CurrenciesValues;
    };
    fact: {
      list: Income[];
      sum: CurrenciesValues;
    };
  };
}
