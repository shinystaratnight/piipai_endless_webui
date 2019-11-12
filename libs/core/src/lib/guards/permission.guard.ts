import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { combineLatest, of } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import {
  UserService,
  NavigationService,
  CheckPermissionService
} from '../services';
import { User, Role } from '@webui/data';
import { isManager } from '@webui/utilities';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private userServise: UserService,
    private checkPermissionServise: CheckPermissionService,
    private navigationService: NavigationService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot) {
    return this.userServise.getUserData().pipe(
      mergeMap((user: User) => {
        const requests = [
          of(user),
          this.navigationService.getPages(user.currentRole)
        ];

        if (isManager()) {
          requests.push(
            this.checkPermissionServise.getPermissions(user.data.user)
          );
        }
        return combineLatest(...requests);
      }),
      mergeMap((response: any) => {
        const role: Role = response[0].currentRole;

        if (role.__str__.includes('manager') || role.__str__.includes('trial')) {
          let routeSegments = (<any>route)._urlSegment.segments;

          if (routeSegments[0].path === 'mn') {
            routeSegments = routeSegments.slice(1);
          }

          return this.checkPermissionServise
            .checkPermission(response[0].data.user, routeSegments, response[1])
            .pipe(
              tap((res: boolean) => !res && this.router.navigate(['login']))
            );
        } else {
          return of(true);
        }
      })
    );
  }
}
