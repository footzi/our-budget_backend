import { SAVING_ACTION_TYPE } from '../savings.constants';

export class UpdateSavingPlanDto {
  id: number;
  goalId: number;
  value: number;
  date: Date;
  comment?: string;
  actionType: SAVING_ACTION_TYPE;
}
