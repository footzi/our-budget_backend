import { CURRENCIES } from '../../currencies/currencies.constants';
import { User } from '../../users/interfaces/users.interface';
import { SAVING_ACTION_TYPE } from '../savings.constants';

export class SavingGoal {
  id?: number;
  name: string;
  description?: string;
  value?: number | null;
  finishValue?: number | null;
  user: User;
  createdAt?: Date;
  currency: CURRENCIES;
}

export class Saving {
  id?: number;
  user: User;
  goal: SavingGoal;
  actionType?: SAVING_ACTION_TYPE;
  value: number;
  comment: string;
  date: Date;
  createdAt?: Date;
  currency: CURRENCIES;
}
