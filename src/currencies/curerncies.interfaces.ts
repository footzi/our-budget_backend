import { CURRENCIES } from './currencies.constants';

export type CurrenciesValues = {
  [key in CURRENCIES]?: number;
};
