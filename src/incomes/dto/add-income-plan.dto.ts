import { CURRENCIES } from '../../currencies/currencies.constants';

export interface AddIncomePlanDto {
  categoryId: number;
  value: number;
  date: Date;
  comment?: string;
  currency: CURRENCIES;
}
