import { Injectable, Inject, Injector, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { LocalStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Role } from '@webui/data';

import { NavigationService } from './navigation.service';
import { CheckPermissionService } from './check-permission.service';
import { ErrorsService } from './errors.service';

import { ENV } from './env.service';
import { isClient, isCandidate, isManager } from '@webui/utilities';

@Injectable()
export class AuthService {
  public loginWithTokenEndpoint: string;
  public refreshTokenEndpoint = '/oauth2/token/';
  public logoutAction: Subject<any> = new Subject();

  private _role: Role;

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private navigation: NavigationService,
    private permission: CheckPermissionService,
    private error: ErrorsService,
    private router: Router,
    @Optional() @Inject(ENV) private env: any
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

  public storeToken(response, rememberMe?, username?) {
    let data = {};

    if (response.data) {
      data = response.data;
    } else {
      data = response;
    }

    const { access_token = '', access_token_jwt = '', refresh_token = '',  } = {...data};
    this.storage.store('user', { access_token, refresh_token, access_token_jwt, rememberMe, username });
  }

  public getRedirectUrl() {
    if (isClient()) {
      return 'cl';
    }

    if (isCandidate()) {
      return 'cd';
    }

    if (isManager()) {
      return 'mn';
    }
  }

  public refreshJWTToken(user) {
    const { refresh_token = '', username = '' } = { ...user };
    const body = {
      refresh_token,
      username,
      client_id: this.env.clientId,
      grant_type: 'refresh_token'
    };

    return this.http.post(this.refreshTokenEndpoint, body)
      .pipe(
        tap((response: any) => {
          this.storage.store('user', {
            ...user,
            access_token: response.access_token_jwt,
            refresh_token: response.refresh_token
          });
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

  public logoutWithoutRedirect() {
    this.storage.clear('role');
    this.storage.clear('user');
  }

  public logout() {
    this.navigation.navigationList = {};
    this.permission.permissions = null;
    this.storage.clear('role');
    this.storage.clear('user');
    this.logoutAction.next(true);
    this.router.navigate(['login']);
  }
}
