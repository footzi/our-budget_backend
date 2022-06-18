import { USER_ROLES } from '../../users/users.constants';

export interface Auth {
  id: number;
  userId: number;
  refresh: string;
}

export interface UserJWTPayload {
  id: number;
  login: string;
  roles: USER_ROLES[];
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
