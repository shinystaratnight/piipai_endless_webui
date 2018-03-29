import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { GenericFormService } from '../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { NavigationService } from './navigation.service';

export interface User {
  status: string;
  data: {
    contact: {
      contact_id: string;
      contact_type: string;
      id: string;
      name: string;
      __str__: string;
    },
    user: string;
  };
  roles: string[];
  currentRole: string;
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
    private navigation: NavigationService
  ) {}

  public getUserData(): Observable<User> {
    if (!this.user) {
      return Observable.combineLatest(this.service.getAll(this.authEndpoint), this.getUserRoles())
        .map(
          (res: [User, { roles: string[] }]) => {
            this.user = res[0];
            this.user.roles = res[1].roles;
            this.user.currentRole = this.user.data.contact.contact_type || res[1].roles[0];
            return this.user;
          })
        .catch((err: any) => Observable.throw(err));
    } else {
      return Observable.of(this.user);
    }
  }

  public getUserRoles() {
    return this.service.getAll(this.rolesEndpoint);
  }

  public currentRole(role) {
    this.user.currentRole = role;
    this.navigation.setCurrentRole(role);
  }

  public logout() {
    this.service.submitForm(this.logoutEndpoint, {1: ''}).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.user = null;
          this.navigation.navigationList = null;
          this.cookie.remove('sessionid');
          this.router.navigate(['/home']);
        }
      },
      (err: any) => this.error = err
    );
  }

  public resolve() {
    return this.getUserData();
  }
}
