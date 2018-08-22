import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'ng2-webstorage';

import { GenericFormService } from '../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

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

  public authEndpoint: string = '/ecore/api/v2/auth/restore_session/';
  public logoutEndpoint: string = '/ecore/api/v2/auth/logout/';
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
        .switchMap(
          (user: User) => this.getUserRoles(),
          (user: User, role: { roles: Role[] }) => [user, role])
        .map((res: [User, { roles: Role[] }]) => {
          const user: User = res[0];
          const roles: Role[] = res[1].roles;
          const redirectRole = this.loginService.role;

          user.roles = roles;

          let role: Role;
          if (this.storage.retrieve('role')) {
            role = roles.find(
              (el) => el.id === this.storage.retrieve('role').id
            );
          } else {
            role = roles.find(
              (el) => el.__str__.includes(user.data.contact.contact_type)
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

          user.currentRole = role || roles[0];

          this.storage.store('role', user.currentRole);

          this.user = user;
          return this.user;
        })
      .catch((err: any) => Observable.throw(err));
    } else {
      return Observable.of(this.user);
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
