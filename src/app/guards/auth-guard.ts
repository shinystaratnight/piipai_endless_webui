import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { combineLatest, of } from 'rxjs';
import { tap, mergeMap, catchError } from 'rxjs/operators';

import { LocalStorageService } from 'ngx-webstorage';

import { UserService, User, NavigationService, Role, SiteSettingsService, AuthService } from '../services/';
import { CheckPermissionService } from '../shared/services/';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userServise: UserService,
    private checkPermissionServise: CheckPermissionService,
    private navigationService: NavigationService,
    private siteSettings: SiteSettingsService,
    private storage: LocalStorageService,
    private authService: AuthService
  ) {}

  public canActivate() {
    const isAuthorized = this.authService.isAuthorized;

    if (isAuthorized) {
      return isAuthorized;
    }

    this.router.navigate(['/login']);
    return false;


    // return this.userServise
    //   .getUserData()
    //   .pipe(
    //     mergeMap((user: User) => {
    //       return combineLatest(
    //         of(user),
    //         this.navigationService.getPages(user.currentRole),
    //         this.siteSettings.resolve(),
    //         this.checkPermissionServise.getPermissions(user.data.user)
    //       );
    //     }),
    //     mergeMap((response: any) => {
    //       const role: Role = response[0].currentRole;

    //       if (role.__str__.includes('manager')) {
    //         return this.checkPermissionServise
    //           .checkPermission(
    //             response[0].data.user,
    //             (<any> route)._urlSegment.segments,
    //             response[1]
    //           )
    //           .pipe(
    //             tap((res: boolean) => !res && this.router.navigate(['login']))
    //           );
    //       } else {
    //         return of(true);
    //       }
    //     }),
    //     catchError(() => {
    //       this.router.navigate(['login']);
    //       return of(false);
    //     })
    //   );
  }
}
