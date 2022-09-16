import { User } from '../../users/interfaces/users.interface';
import { Tokens } from '../interfaces/auth.interface';

export class SignUpDto {
  login: string;
  firstName: string;
  password: string;
  password2: string;
}

export class SignUpOutDto {
  user: User;
  tokens: Tokens;
}
