import { CURRENCIES } from '../../currencies/currencies.constants';

export class AddExpenseFactDto {
  categoryId: number;
  value: number;
  date: Date;
  comment?: string;
  currency: CURRENCIES;
}
