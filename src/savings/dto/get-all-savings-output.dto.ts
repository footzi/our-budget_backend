import { CurrenciesValues } from '../../currencies/curerncies.interfaces';
import { Saving } from '../interfaces/saving.interface';

export class GetAllSavingsOutputDto {
  savings: {
    plan: {
      list: Saving[];
      sum: CurrenciesValues;
    };
    fact: {
      list: Saving[];
      sum: CurrenciesValues;
    };
  };
}
