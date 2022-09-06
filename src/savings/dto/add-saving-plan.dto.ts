import { SAVING_ACTION_TYPE } from '../savings.constants';

export class AddSavingPlanDto {
  goalId: number;
  value: number;
  date: Date;
  comment?: string;
  actionType: SAVING_ACTION_TYPE;
}
