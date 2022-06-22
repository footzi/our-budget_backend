import { Expense } from '../interfaces/expense.interfaces';

export interface GetAllExpensesOutputDto {
  expenses: {
    plan: {
      list: Expense[];
      sum: number;
    };
    fact: {
      list: Expense[];
      sum: number;
    };
  };
}
