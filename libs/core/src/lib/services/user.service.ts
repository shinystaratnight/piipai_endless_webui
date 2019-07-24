import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { User, Role } from '@webui/data';

// import { GenericFormService } from '../dynamic-form/services/generic-form.service';
// import { ToastService, MessageType, CheckPermissionService } from '../shared/services';
import { NavigationService } from './navigation.service';
import { AuthService } from './auth.service';
import { ErrorsService } from './errors.service';
import { ToastService, MessageType } from './toast.service';

// export interface User {
//   status: string;
//   data: {
//     contact: {
//       company: string;
//       picture: {
//         origin: string;
//         thumb: string;
//       },
//       email: string;
//       contact_id: string;
//       contact_type: string;
//       company_id: string;
//       candidate_contact: string;
//       id: string;
//       name: string;
//       __str__: string;
//     },
//     is_primary: boolean;
//     user: string;
//   };
//   roles: Role[];
//   currentRole: Role;
// }

// export interface Role {
//   __str__: string;
//   id: string;
//   name: string;
//   company_id?: string;
// }

@Injectable()
export class UserService {

  public authEndpoint = '/auth/restore_session/';
  public rolesEndpoint = '/core/users/roles/';
  public user: User;
  public error: any;

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
          mergeMap((user: User) => {
            this.user = user;

            return this.getUserRoles();
          }),
          map((res: { roles: Role[] }) => {
            if (!this.user.data.contact.contact_type || !res.roles.length) {
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
              role = res.roles.find(
                (el) => el.id === storageRole.id
              );
            } else {
              role = res.roles.find(
                (el) => el.__str__.includes(this.user.data.contact.contact_type)
              );
            }

            if (redirectRole) {
              const existRole = res.roles.find((el) => el.id === redirectRole.id );
              if (existRole) {
                role = existRole;
              } else {
                role = redirectRole;
                res.roles.push(role);
              }
            }

            this.user.currentRole = role || this.user.roles[0];
            this.user.roles = res.roles;
            this.storage.store('role', this.user.currentRole);

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

  public currentRole(role) {
    this.user.currentRole = role;
    this.storage.store('role', role);
    this.navigation.setCurrentRole(role);
  }

  public resolve() {
    return this.getUserData();
  }
}
