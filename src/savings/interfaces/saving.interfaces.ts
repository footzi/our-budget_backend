import { User } from '../../users/interfaces/users.interface';
import { SAVING_ACTION_TYPE } from '../savings.constants';

export interface SavingGoal {
  id?: number;
  name: string;
  description?: string;
  value?: number | null;
  finishValue?: number | null;
  user: User;
}

export interface Saving {
  id?: number;
  user: User;
  goal: SavingGoal;
  actionType?: SAVING_ACTION_TYPE;
  value: number;
  comment: string;
  date: string;
}
