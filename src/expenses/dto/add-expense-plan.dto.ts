import { CURRENCIES } from '../../currencies/currencies.constants';

export class AddExpensePlanDto {
  categoryId: number;
  value: number;
  date: Date;
  comment?: string;
  currency: CURRENCIES;
}
