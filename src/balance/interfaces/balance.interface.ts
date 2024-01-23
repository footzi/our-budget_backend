import { CurrenciesValues } from '../../currencies/curerncies.interfaces';
import { CURRENCIES } from '../../currencies/currencies.constants';
import { User } from '../../users/interfaces/users.interface';
import { BALANCE_ACTIONS } from '../balances.constants';

export class Balance {
  id?: number;
  user: User;
  common: number;
  values: CurrenciesValues;
}

export class BalanceHistory {
  id?: number;
  createdAt: Date;
  user: User;
  currency: CURRENCIES;
  action: BALANCE_ACTIONS;
  oldValue: number;
  newValue: number;
}
