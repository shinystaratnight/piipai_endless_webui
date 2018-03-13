import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { GenericFormService } from '../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';
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
}

@Injectable()
export class UserService {

  public authEndpoint: string = '/ecore/api/v2/auth/restore_session/';
  public logoutEndpoint: string = '/ecore/api/v2/auth/logout/';
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
      return this.service.getAll(`${this.authEndpoint}`).map(
        (user: User) => {
          this.user = user;
          return this.user;
        }
      ).catch((err: any) => Observable.throw(err));
    } else if (this.user) {
      return Observable.of(this.user);
    }
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
