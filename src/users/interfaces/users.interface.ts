import { USER_ROLES } from '../users.constants';

export interface User {
  id?: number;
  login: string;
  firstName: string;
  roles: USER_ROLES[];
  password?: string;
}
