import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';
import { LocalStorageService } from 'ngx-webstorage';

import { GenericFormService } from '../dynamic-form/services/generic-form.service';

import { Observable, throwError, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { NavigationService } from './navigation.service';
import { CheckPermissionService } from '../shared/services';
import { LoginService } from './login.service';

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

  public authEndpoint = '/ecore/api/v2/auth/restore_session/';
  public logoutEndpoint = '/ecore/api/v2/auth/logout/';
  public rolesEndpoint = '/ecore/api/v2/core/users/roles/';
  public user: User;
  public error: any;

  constructor(
    private service: GenericFormService,
    private router: Router,
    private cookie: CookieService,
    private navigation: NavigationService,
    private permission: CheckPermissionService,
    private storage: LocalStorageService,
    private loginService: LoginService
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
            const redirectRole: Role = this.loginService.role;
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

  public logout() {
    this.service.submitForm(this.logoutEndpoint, {1: ''}).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.user = null;
          this.navigation.navigationList = {};
          this.permission.permissions = null;
          this.storage.clear('role');
          this.cookie.remove('sessionid');
          this.router.navigate(['login']);
        }
      },
      (err: any) => this.error = err
    );
  }

  public resolve() {
    return this.getUserData();
  }
}
