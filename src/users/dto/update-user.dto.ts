import { CURRENCIES } from '../../currencies/currencies.constants';

export class UpdateUserDto {
  firstName: string;
  currencies: CURRENCIES[];
}
