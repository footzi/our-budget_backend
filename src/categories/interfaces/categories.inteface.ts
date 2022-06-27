import { User } from '../../users/interfaces/users.interface';
import { CATEGORIES_TYPES } from '../constants.categories';

export interface Category {
  id?: number;
  name: string;
  user: User;
  type: CATEGORIES_TYPES;
  startDate?: string;
  endDate?: string;
}
