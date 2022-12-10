import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LocalStorageService } from 'ngx-webstorage';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ErrorsService } from './errors.service';
import { ToastService, MessageType } from './toast.service';
import { EventService, EventType } from './event.service';
import { ENV } from './env.service';
import { Language, Role, User } from '@webui/models';

const defaultCountryCode = 'GB';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public authEndpoint = '/auth/restore_session/';
  public rolesEndpoint = '/core/users/roles/';
  public timezoneEndpoint = '/core/users/timezone/';
  public user?: User | null;
  public error: any;
  public roleRedirect!: string;

  get companyId(): string {
    if (this.user) {
      return this.user.data.contact.company_id;
    }

    return '';
  }

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private toastService: ToastService,
    private authService: AuthService,
    private errorsService: ErrorsService,
    private eventService: EventService,
    @Optional() @Inject(ENV) private env: any
  ) {}

  public getUserData() {
    if (!this.user && this.storage.retrieve('user')) {
      return this.http.get<User>(this.authEndpoint).pipe(
        map((user) => {
          this.user = user;

          user.data.roles = user.data.roles
          .filter((role) => role.is_active)
          .map((role: Role) => {
            return {
              ...role,
              company_id: role.company_contact_rel.company.id,
              client_contact_id: role.company_contact_rel.company_contact.id
            }
          });

          const currentDomainRoles = user.data.roles.filter((role) => {
            return role.domain === location.host || (this.env.origin ? this.env.origin.replace('https://', '') === role.domain : false);
          });

          this.checkRoleExist(user.data.contact.contact_type, currentDomainRoles);

          user.data.country_code = user.data.country_code || defaultCountryCode;

          const roles = user.data.roles;
          const redirectRole: Role | undefined = this.authService.role;
          const storageRole: Role = this.storage.retrieve('role');
          const lang: Language = this.storage.retrieve('lang') as Language;

          let role: Role | undefined;

          if (storageRole) {
            role = currentDomainRoles.find(el => el.id === storageRole.id);
          } else {
            role = currentDomainRoles.find(el =>
              this.user && el.__str__.includes(this.user.data.contact.contact_type)
            );
          }

          if (redirectRole) {
            const existRole = currentDomainRoles.find(el => el.id === redirectRole.id);

            if (existRole) {
              role = existRole;
            } else {
              role = redirectRole;
              roles.push(role);
            }
          }

          this.user.currentRole = role || currentDomainRoles[0];
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

  public currentRole(role: Role) {
    if (this.user) {
      this.user.currentRole = role;
      this.storage.store('role', role);
      this.eventService.emit(EventType.RoleChanged);
    }
  }

  public resolve() {
    return this.getUserData();
  }

  private checkRoleExist(contactType: string, roles: Role[]): void {
    if (!contactType || !roles.length) {
      this.authService.logout();

      setTimeout(() => {
        this.toastService.sendMessage(
          'User is invalid',
          MessageType.Error
        );
      }, 1000);

      throw Error('User is invalid');
    }
  }
}
