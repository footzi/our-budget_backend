import { CURRENCIES } from '../../currencies/currencies.constants';
import { USER_ROLES } from '../users.constants';

export class User {
  id?: number;
  login: string;
  firstName: string;
  roles: USER_ROLES[];
  password?: string;
  currencies: CURRENCIES[];
}
