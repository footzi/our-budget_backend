import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { USER_ROLES } from '../../users/users.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Проверяет подходят ли роли из гарды для ролей пользователя
   *
   * @param {USER_ROLES} guardRoles - роли гарды
   * @param {USER_ROLES} userRoles - роли пользователя
   */
  matchRoles(guardRoles: USER_ROLES[], userRoles: USER_ROLES[]): boolean {
    return guardRoles.reduce((result: boolean, item: USER_ROLES) => {
      const match = userRoles.some((role) => item === role);

      if (!match) {
        result = false;
      }

      return result;
    }, true);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<USER_ROLES[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(roles, user.roles);
  }
}
