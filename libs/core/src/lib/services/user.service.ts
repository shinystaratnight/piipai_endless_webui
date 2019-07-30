import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, Role } from '@webui/data';
import { setTimeZone } from '@webui/utilities';

import { NavigationService } from './navigation.service';
import { AuthService } from './auth.service';
import { ErrorsService } from './errors.service';
import { ToastService, MessageType } from './toast.service';

@Injectable()
export class UserService {

  public authEndpoint = '/auth/restore_session/';
  public rolesEndpoint = '/core/users/roles/';
  public timezoneEndpoint = '/core/users/timezone/'
  public user: User;
  public error: any;
  public roleRedirect: string;

  constructor(
    private http: HttpClient,
    private navigation: NavigationService,
    private storage: LocalStorageService,
    private toastService: ToastService,
    private authService: AuthService,
    private errorsService: ErrorsService
  ) {}

  public getUserData(): Observable<any> {
    if (!this.user) {
      return this.http
        .get(this.authEndpoint)
        .pipe(
          map((user: User) => {
            this.user = user;
            const roles = user.data.roles;
            if (!user.data.contact.contact_type || !roles.length) {
              this.authService.logout();

              setTimeout(() => {
                this.toastService.sendMessage('User is invalid', MessageType.error);
              }, 1000);
              throw 'User is invalid';
              return;
            }

            const redirectRole: Role = this.authService.role;
            const storageRole: Role = this.storage.retrieve('role');
            let role: Role;

            if (storageRole) {
              role = roles.find(
                (el) => el.id === storageRole.id
              );
            } else {
              role = roles.find(
                (el) => el.__str__.includes(this.user.data.contact.contact_type)
              );
            }

            if (redirectRole) {
              const existRole = roles.find((el) => el.id === redirectRole.id );
              if (existRole) {
                role = existRole;
              } else {
                role = redirectRole;
                roles.push(role);
              }
            }

            this.user.currentRole = role || roles[0];
            this.storage.store('role', this.user.currentRole);
            const timeZone = this.getTimeZone();
            if (timeZone) {
              setTimeZone(timeZone);
            }

            return this.user;
          }),
          catchError((errors) => this.errorsService.parseErrors(errors))
        );
    } else {
      return of(this.user);
    }
  }

  public getUserRoles(): Observable<any> {
    return this.http.get(this.rolesEndpoint)
      .pipe(
        catchError((errors) => this.errorsService.parseErrors(errors))
      );
  }

  public setTimezone(): Observable<any> {
    const timeZone = this.getTimeZone();

    return this.http.post(this.timezoneEndpoint, { user_timezone: timeZone })
      .pipe(
        catchError((errors) => this.errorsService.parseErrors(errors))
      );
  }

  public getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public currentRole(role) {
    this.user.currentRole = role;
    this.storage.store('role', role);
    this.navigation.setCurrentRole(role);
  }

  public resolve() {
    return this.getUserData();
  }
}
