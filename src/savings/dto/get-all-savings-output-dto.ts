import { Saving } from '../interfaces/saving.interfaces';

export interface GetAllSavingsOutputDto {
  savings: {
    plan: {
      list: Saving[];
      sum: number;
    };
    fact: {
      list: Saving[];
      sum: number;
    };
  };
}
