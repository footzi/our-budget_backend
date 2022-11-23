import { CurrenciesValues } from '../../currencies/curerncies.interfaces';
import { Expense } from '../interfaces/expense.interface';

export class GetAllExpensesOutputDto {
  expenses: {
    plan: {
      list: Expense[];
      sum: CurrenciesValues;
    };
    fact: {
      list: Expense[];
      sum: CurrenciesValues;
    };
  };
}
