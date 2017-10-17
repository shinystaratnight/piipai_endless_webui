import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {

  public url: string;
  public _username: any;

  constructor(private http: Http) {}

  set username(value) {
    this._username = value;
  }

  get username() {
    return this._username;
  }

  public loginWithToken(token) {
    this.username = null;
    let url = `/ecore/api/v2/auth/${token}/login_by_token/`;
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

}
