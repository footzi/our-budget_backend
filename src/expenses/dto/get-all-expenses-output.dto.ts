import { Expense } from '../interfaces/expense.interface';

export class GetAllExpensesOutputDto {
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
