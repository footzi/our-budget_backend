import { CURRENCIES } from '../../currencies/currencies.constants';

export class AddSavingGoalDto {
  name: string;
  description?: string;
  finishValue?: number;
  value?: number;
  currency: CURRENCIES;
}
