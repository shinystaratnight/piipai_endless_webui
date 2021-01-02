import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { combineLatest, forkJoin, of, Subject } from 'rxjs';
import { tap, mergeMap, map, concatAll, mergeAll, catchError } from 'rxjs/operators';

import {
  UserService,
  NavigationService,
  CheckPermissionService
} from '../services';
import { User, Role } from '@webui/data';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private userServise: UserService,
    private checkPermissionServise: CheckPermissionService,
    private navigationService: NavigationService
  ) {}

  isManager(role: Role): boolean {
    const { __str__: title } = role;

    return title.includes('manager') || title.includes('trial');
  }

  public canActivate(route: ActivatedRouteSnapshot) {
    const subject = new Subject<boolean>();

    setTimeout(() => {
      this.userServise.getUserData()
      .pipe(
        catchError(() => of(false))
      )
      .subscribe((user: User) => {
        const requests = [this.navigationService.getPages(user.currentRole)];

        if (this.isManager(user.currentRole)) {
          requests.push(this.checkPermissionServise.getPermissions(user.data.user));
        }

        forkJoin(requests).subscribe(([ navigation ]) => {
          if (!this.isManager(user.currentRole)) {
            subject.next(true);
          }

          let routeSegments = (<any>route)._urlSegment.segments;

          if (routeSegments[0].path === 'mn') {
            routeSegments = routeSegments.slice(1);
          }

          this.checkPermissionServise
            .checkPermission(user.data.user, routeSegments, navigation)
            .subscribe((hasAccess) => {
              if (hasAccess) {
                subject.next(hasAccess);
                return;
              }

              this.router.navigate(['/']);
            });
        })
      });
    });

    return subject.asObservable().pipe(tap(console.log));
  }
}
