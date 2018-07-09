import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';

import { UserService, User, NavigationService, Role } from '../services/';
import { CheckPermissionService } from '../shared/services/';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userServise: UserService,
    private checkPermissionServise: CheckPermissionService,
    private navigationService: NavigationService,
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> {
    return this.userServise.getUserData()
      .mergeMap((user: User) => {
        return Observable.combineLatest(
          Observable.of(user),
          this.navigationService.getPages(user.currentRole)
        );
      })
      .mergeMap((response: any) => {
        const role: Role = response[0].currentRole;

        if (role.__str__.includes('manager') || role.__str__.includes('client')) {
          return this.checkPermissionServise.checkPermission(
              response[0].data.user,
              (<any> route)._urlSegment.segments,
              response[1]
            )
            .do((res: boolean) => !res && this.router.navigate(['login']));
        } else {
          return Observable.of(true);
        }
      })
      .catch((err: any) => {
        this.router.navigate(['login']);
        return Observable.of(false);
      });
  }
}
