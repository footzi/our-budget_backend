import { User } from '../../users/interfaces/users.interface';
import { Tokens } from '../interfaces/auth.interface';

export class RefreshOutDto {
  user: User;
  tokens: Tokens;
}
