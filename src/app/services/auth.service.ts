import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { LocalStorageService } from 'ngx-webstorage';
import { catchError, tap } from 'rxjs/operators';

import { Role } from './user.service';
import { NavigationService } from './navigation.service';
import { CheckPermissionService, ErrorsService } from '../shared/services';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  public loginWithTokenEndpoint: string;
  public refreshTokenEndpoint = '/oauth2/revoke_token/';

  private _role: Role;

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private navigation: NavigationService,
    private permission: CheckPermissionService,
    private error: ErrorsService,
    private router: Router
  ) {}

  set role(role: Role) {
    this._role = role;
  }

  get role() {
    return this._role;
  }

  get isAuthorized() {
    return !!this.storage.retrieve('user');
  }

  public storeToken(response, rememberMe?) {
    let data = {};

    if (response.data) {
      data = response.data;
    } else {
      data = response;
    }

    const { access_token = '', access_token_jwt = '', refresh_token = '',  } = {...data};
    this.storage.store('user', { access_token, refresh_token, access_token_jwt, rememberMe });
  }

  public refreshJWTToken(user) {
    const { access_token = '' } = { ...user };
    const body = {
      token: access_token,
      client_id: environment.clientId
    };

    return this.http.post(this.refreshTokenEndpoint, body)
      .pipe(
        tap((response: any) => {
          this.storage.store('user', { ...user, access_token: response.access });
        }),
        catchError((error: any) => this.error.parseErrors(error))
      );
  }

  public loginWithToken(token) {
    const url = `/auth/${token}/login_by_token/`;
    return this.http.get(url)
      .pipe(
        tap((response: any) => {
          this.storeToken(response);
        }),
        catchError((error: any) => this.error.parseErrors(error))
      );
  }

  public logout() {
    this.navigation.navigationList = {};
    this.permission.permissions = null;
    this.storage.clear('role');
    this.storage.clear('user');
    this.router.navigate(['login']);
  }
}
