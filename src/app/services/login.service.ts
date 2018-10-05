import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
    const url = `/ecore/api/v2/auth/${token}/login_by_token/`;
    return this.http
      .get(url)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: any) => throwError(error.json() || 'Server error'))
      );
  }

}
