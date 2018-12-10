import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { GenericFormService } from '../dynamic-form/services/generic-form.service';
import { ToastService, MessageType, CheckPermissionService } from '../shared/services';
import { NavigationService } from './navigation.service';
import { AuthService } from './auth.service';

export interface User {
  status: string;
  data: {
    contact: {
      company: string;
      picture: {
        origin: string;
        thumb: string;
      },
      email: string;
      contact_id: string;
      contact_type: string;
      candidate_contact: string;
      id: string;
      name: string;
      __str__: string;
    },
    user: string;
  };
  roles: Role[];
  currentRole: Role;
}

export interface Role {
  __str__: string;
  id: string;
  name: string;
}

@Injectable()
export class UserService {

  public authEndpoint = '/auth/restore_session/';
  public rolesEndpoint = '/core/users/roles/';
  public user: User;
  public error: any;

  constructor(
    private service: GenericFormService,
    private navigation: NavigationService,
    private storage: LocalStorageService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  public getUserData(): Observable<User> {
    if (!this.user) {
      return this.service
        .getAll(this.authEndpoint)
        .pipe(
          mergeMap((user: User) => {
            this.user = user;

            return this.getUserRoles();
          }),
          map((res: { roles: Role[] }) => {
            if (!this.user.data.contact.contact_type || !res.roles.length) {
              this.authService.logout();

              this.toastService.sendMessage('User is invalid', MessageType.error);
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
          catchError((err: any) => throwError(err))
        );
    } else {
      return of(this.user);
    }
  }

  public getUserRoles(): Observable<{ roles: Role[] }> {
    return this.service.getAll(this.rolesEndpoint);
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
