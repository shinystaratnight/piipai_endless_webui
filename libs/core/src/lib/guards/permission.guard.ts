import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { forkJoin, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  UserService,
  NavigationService,
  CheckPermissionService,
  SubscriptionService,
} from '../services';
import { User, Role } from '@webui/data';
import { Time } from '@webui/time';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private checkPermissionService: CheckPermissionService,
    private navigationService: NavigationService,
    private subscriptionService: SubscriptionService
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
      this.userService
        .getUserData()
        .pipe(catchError(() => of(false)))
        .subscribe((user: User) => {
          const requests = [this.navigationService.getPages(user.currentRole)];

          if (this.isManager(user.currentRole)) {
            const endTrial = Time.parse(user.data.end_trial_date);
            const trialExpired = endTrial.isBefore(Time.now());

            if (trialExpired) {
              this.subscriptionService.update();
            } else {
              this.subscriptionService.useTrialPermissions();
            }

            requests.push(
              this.checkPermissionService.getPermissions(user.data.user)
            );
          } else {
            this.subscriptionService.useClientPermissions();
          }

          forkJoin(requests).subscribe(([navigation]) => {
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

            this.checkPermissionService
              .checkPermission(user.data.user, routeSegments, navigation)
              .subscribe((hasAccess) => {
                if (hasAccess) {
                  subject.next(hasAccess);
                  return;
                }

                this.router.navigate(['/']);
              });
          });
        });
    });

    return subject.asObservable();
  }
}
