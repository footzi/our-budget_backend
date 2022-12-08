import { CURRENCIES } from '../../currencies/currencies.constants';
import { SAVING_ACTION_TYPE } from '../savings.constants';

export class UpdateSavingFactDto {
  id: number;
  goalId: number;
  value: number;
  date: Date;
  comment?: string;
  actionType: SAVING_ACTION_TYPE;
  currency: CURRENCIES;
}
