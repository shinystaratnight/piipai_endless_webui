import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Role } from './user.service';

@Injectable()
export class LoginService {

  public url: string;
  private _username: any;
  private _role: Role;

  constructor(private http: Http) {}

  set username(value) {
    this._username = value;
  }

  get username() {
    return this._username;
  }

  set role(role: Role) {
    this._role = role;
  }

  get role() {
    return this._role;
  }

  public loginWithToken(token) {
    this.username = null;
    let url = `/ecore/api/v2/auth/${token}/login_by_token/`;
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

}
