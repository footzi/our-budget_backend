import { Saving } from '../interfaces/saving.interfaces';

export interface GetAllSavingsOutputDto {
  saving: {
    plan: Saving[];
    fact: Saving[];
  };
}
