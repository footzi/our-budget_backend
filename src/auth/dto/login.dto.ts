import { User } from '../../users/interfaces/users.interface';
import { Tokens } from '../interfaces/auth.interface';

export class LoginOutDto {
  user: User;
  tokens: Tokens;
}
