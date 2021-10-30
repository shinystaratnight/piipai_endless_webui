import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, Role, Language } from '@webui/data';

import { AuthService } from './auth.service';
import { ErrorsService } from './errors.service';
import { ToastService, MessageType } from './toast.service';
import { EventService, EventType } from './event.service';
import { isManager } from '@webui/utilities';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public authEndpoint = '/auth/restore_session/';
  public rolesEndpoint = '/core/users/roles/';
  public timezoneEndpoint = '/core/users/timezone/';
  public user: User;
  public error: any;
  public roleRedirect: string;

  get companyId() {
    if (this.user) {
      return this.user.data.contact.company_id;
    }
  }

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private toastService: ToastService,
    private authService: AuthService,
    private errorsService: ErrorsService,
    private eventService: EventService,
  ) {}

  public getUserData(): Observable<any> {
    if (!this.user) {
      return this.http.get(this.authEndpoint).pipe(
        map((user: User) => {
          this.user = user;

          if (!user.data.country_code) {
            user.data.country_code = 'GB';
          }

          user.data.roles = user.data.roles.map((role: Role) => {

            return {
              ...role,
              company_id: role.company_contact_rel.company.id,
              client_contact_id: role.company_contact_rel.company_contact.id
            }
          });
          const roles = user.data.roles;
          if (!user.data.contact.contact_type || !roles.length) {
            this.authService.logout();

            setTimeout(() => {
              this.toastService.sendMessage(
                'User is invalid',
                MessageType.Error
              );
            }, 1000);
            throw Error('User is invalid');
          }

          const redirectRole: Role = this.authService.role;
          const storageRole: Role = this.storage.retrieve('role');
          const lang: Language = this.storage.retrieve('lang');

          let role: Role;

          if (storageRole) {
            role = roles.find(el => el.id === storageRole.id);
          } else {
            role = roles.find(el =>
              el.__str__.includes(this.user.data.contact.contact_type)
            );
          }

          if (redirectRole) {
            const existRole = roles.find(el => el.id === redirectRole.id);
            if (existRole) {
              role = existRole;
            } else {
              role = redirectRole;
              roles.push(role);
            }
          }

          this.user.currentRole = role || roles[0];
          this.storage.store('role', this.user.currentRole);

          if (!lang && user.data.contact.default_language) {
            this.storage.store('lang', user.data.contact.default_language);
          }

          return this.user;
        }),
        catchError(errors => this.errorsService.handleError(errors))
      );
    } else {
      return of(this.user);
    }
  }

  public setTimezone(): Observable<any> {
    const timeZone = this.getTimeZone();

    return this.http
      .post(this.timezoneEndpoint, { user_timezone: timeZone })
      .pipe(catchError(errors => this.errorsService.handleError(errors)));
  }

  public getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public currentRole(role: Role) {
    this.user.currentRole = role;
    this.storage.store('role', role);
    this.eventService.emit(EventType.RoleChanged);
  }

  public resolve() {
    return this.getUserData();
  }
}
