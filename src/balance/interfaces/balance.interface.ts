import { User } from '../../users/interfaces/users.interface';

export class Balance {
  id?: number;
  user: User;
  common: number;
}
