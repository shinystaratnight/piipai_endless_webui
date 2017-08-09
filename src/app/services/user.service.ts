import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { CookieService } from 'angular2-cookie/core';
import { GenericFormService } from '../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {

  public contactEndpoint: string = '/ecore/api/v2/endless-core/contacts/';
  public logoutEndpoint: string = '/ecore/api/v2/logout/';
  public user: any;
  public error: any;

  constructor(
    private service: GenericFormService,
    private storage: LocalStorageService,
    private router: Router,
    private cookie: CookieService
  ) {}

  public getUserData(id) {
    if (!this.user) {
      return this.service.getAll(`${this.contactEndpoint}${id}/`).map(
        (res: any) => {
          this.user = res;
          return this.user;
        }
      );
    } else if (this.user) {
      return Observable.of(this.user);
    }
  }

  public logout() {
    this.service.submitForm(this.logoutEndpoint, {1: ''}).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.storage.clear('contact');
          this.cookie.remove('sessionid');
          this.router.navigate(['/login']);
        }
      },
      (err: any) => this.error = err
    );
  }
}
