import { CURRENCIES } from '../../currencies/currencies.constants';

export class UpdateBalanceDto {
  currency: CURRENCIES;
  value: number;
}
