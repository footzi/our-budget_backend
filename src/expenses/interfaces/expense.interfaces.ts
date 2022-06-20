import { Category } from '../../categories/interfaces/categories.inteface';
import { User } from '../../users/interfaces/users.interface';

export interface Expense {
  id?: number;
  user: User;
  category: Category;
  value: number;
  comment: string;
  date: string;
}
