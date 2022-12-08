import { CURRENCIES } from '../../currencies/currencies.constants';

export interface UpdateIncomePlanDto {
  id: number;
  categoryId?: number;
  value?: number;
  date?: Date;
  comment?: string;
  currency: CURRENCIES;
}
