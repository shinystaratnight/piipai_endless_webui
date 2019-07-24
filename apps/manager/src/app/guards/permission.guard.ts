import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { combineLatest, of } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { UserService, NavigationService } from '@webui/core';
import { User, Role } from '@webui/data';
import { CheckPermissionService } from '@webui/core';
import { isManager } from '@webui/utilities';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private router: Router,
    private userServise: UserService,
    private checkPermissionServise: CheckPermissionService,
    private navigationService: NavigationService,
  ) {}

  public canActivate(route: ActivatedRouteSnapshot) {
    return this.userServise
      .getUserData()
      .pipe(
        mergeMap((user: User) => {
          const companyId = isManager() ? user.data.contact.company_id: '';

          return combineLatest(
            of(user),
            this.navigationService.getPages(user.currentRole, companyId),
            this.checkPermissionServise.getPermissions(user.data.user)
          );
        }),
        mergeMap((response: any) => {
          const role: Role = response[0].currentRole;

          if (role.__str__.includes('manager')) {
            return this.checkPermissionServise
              .checkPermission(
                response[0].data.user,
                (<any> route)._urlSegment.segments,
                response[1]
              )
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
