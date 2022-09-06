import { Category } from '../../categories/interfaces/categories.interface';
import { User } from '../../users/interfaces/users.interface';

export class Income {
  id?: number;
  user: User;
  category: Category;
  value: number;
  comment: string;
  date: Date;
  createdAt?: Date;
}
