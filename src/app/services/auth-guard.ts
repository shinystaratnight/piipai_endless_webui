import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { UserService, User } from './user.service';
import { CheckPermissionService } from '../shared/services/check-permission';
import { NavigationService, Page } from './navigation.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userServise: UserService,
    private checkPermissionServise: CheckPermissionService,
    private navigationService: NavigationService,
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> { //tslint:disable-line
      return Observable.combineLatest(this.userServise.getUserData(), this.navigationService.getPages())
        .mergeMap((response: [User, Page[]]) => {
          if (state.url === '/') {
            return Observable.of(true);
          } else {
            return this.checkPermissionServise.checkPermission(
                response[0].data.user,
                route.url,
                response[1]
              );
          }
        })
        .catch((err: any) => {
          this.router.navigate(['/home']);
          return Observable.of(false);
        });
  }
}
