import { CURRENCIES } from '../../currencies/currencies.constants';

export interface AddIncomeFactDto {
  categoryId: number;
  value: number;
  date: Date;
  comment?: string;
  currency: CURRENCIES;
}
