import { USER_ROLES } from '../../users/users.constants';

export class Auth {
  id: number;
  userId: number;
  refresh: string;
}

export class UserJWTPayload {
  id: number;
  login: string;
  roles: USER_ROLES[];
}

export class Tokens {
  accessToken: string;
  refreshToken: string;
}
