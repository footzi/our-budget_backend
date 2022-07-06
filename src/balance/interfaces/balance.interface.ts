import { User } from '../../users/interfaces/users.interface';

export interface Balance {
  id?: number;
  user: User;
  common: number;
}
