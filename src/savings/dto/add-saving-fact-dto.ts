import { SAVING_ACTION_TYPE } from '../savings.constants';

export interface AddSavingFactDto {
  goalId: number;
  value: number;
  date: string;
  comment?: string;
  actionType: SAVING_ACTION_TYPE;
}
