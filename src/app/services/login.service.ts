import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {

  public url: string;
  public username: any;

  constructor(private http: Http) {
    this.url = `/ecore/api/v2/login/`;
  }

  public login(data) {
    this.username = null;
    return this.http.post(this.url, data)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        const register = error.json().errors.register;
        if (register) {
          this.username = {
            field: register,
            value: data.username
          };
        }
        return Observable.throw(error.json() || 'Server error');
      });
  }

  public loginWithToken(token) {
    this.username = null;
    return this.http.get(`${this.url}${token}`)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  public getMetaData() {
    return this.http.options(this.url)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

}
