import { Saving } from '../interfaces/saving.interface';

export class GetAllSavingsOutputDto {
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
