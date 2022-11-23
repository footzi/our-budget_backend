import { Category } from '../../categories/interfaces/categories.interface';
import { CURRENCIES } from '../../currencies/currencies.constants';
import { User } from '../../users/interfaces/users.interface';

export class Income {
  id?: number;
  user: User;
  category: Category;
  currency: CURRENCIES;
  value: number;
  comment: string;
  date: Date;
  createdAt?: Date;
}
