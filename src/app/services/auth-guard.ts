import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';

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

  public canActivate(route: any, state: RouterStateSnapshot): Observable<boolean> {
      return this.userServise.getUserData()
        .mergeMap((user: User) => {
          return Observable.combineLatest(
            Observable.of(user),
            this.navigationService.getPages(user.currentRole)
          );
        })
        .mergeMap((response: any) => {
          const contactType = response[0].currentRole || response[0].data.contact.contact_type;

          if (contactType === 'manager' || contactType === 'client') {
            return this.checkPermissionServise.checkPermission(
                response[0].data.user,
                route._urlSegment.segments,
                response[1]
              )
              .do((res: boolean) => !res && this.router.navigate(['home']));
          } else {
            return Observable.of(true);
          }
        })
        .catch((err: any) => {
          this.router.navigate(['home']);
          return Observable.of(false);
        });
  }
}
