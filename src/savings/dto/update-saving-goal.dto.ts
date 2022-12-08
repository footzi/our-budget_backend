import { CURRENCIES } from '../../currencies/currencies.constants';

export class UpdateSavingGoalDto {
  id: number;
  name: string;
  description?: string;
  finishValue?: number;
  value?: number;
  currency: CURRENCIES;
}
