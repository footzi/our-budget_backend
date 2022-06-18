import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserJWTPayload } from './interfaces/auth.interfaces';
import { Crypt } from '../utils/crypt';
import { User } from '../users/interfaces/users.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refreshtoken') {
  constructor(private authService: AuthService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt').secret,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: UserJWTPayload): Promise<User> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }

    const clientToken = req.headers.authorization.replace('Bearer ', '');
    const authData = await this.authService.getAuthData(payload.id);

    if (!authData) {
      throw new UnauthorizedException();
    }

    if (!(await Crypt.compare(clientToken, authData.refresh))) {
      throw new UnauthorizedException();
    }

    const user = this.authService.getUser(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
