import { User } from '../../users/interfaces/users.interface';

export interface Category {
  id?: number;
  name: string;
  user: User;
  isAdditional?: boolean;
}
