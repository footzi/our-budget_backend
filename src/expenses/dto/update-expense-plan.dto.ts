import { CURRENCIES } from '../../currencies/currencies.constants';

export class UpdateExpensePlanDto {
  id: number;
  categoryId?: number;
  value?: number;
  date?: Date;
  comment?: string;
  currency: CURRENCIES;
}
