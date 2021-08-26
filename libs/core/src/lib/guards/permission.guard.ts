import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { forkJoin, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  UserService,
  NavigationService,
  CheckPermissionService,
  DateService
} from '../services';
import { User, Role } from '@webui/data';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private userServise: UserService,
    private checkPermissionServise: CheckPermissionService,
    private navigationService: NavigationService,
    private dateService: DateService
  ) {}

  isManager(role: Role): boolean {
    if (!role) {
      return false;
    }

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
          const endTrial = this.dateService.instance(user.data.end_trial_date);
          const trielExpired = endTrial.isBefore(this.dateService.instance());
          requests.push(this.checkPermissionServise.getPermissions(user.data.user, trielExpired));
        }

        forkJoin(requests).subscribe(([ navigation ]) => {
          if (!this.isManager(user.currentRole)) {
            subject.next(true);
            return;
          }

          let routeSegments = (<any>route)._urlSegment.segments;

          if (routeSegments[0].path === 'mn') {
            routeSegments = routeSegments.slice(1);
          }

          if (routeSegments[0] && routeSegments[0].path === 'settings') {
            subject.next(true);
            return;
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

    return subject.asObservable();
  }
}
