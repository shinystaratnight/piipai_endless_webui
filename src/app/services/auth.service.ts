import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { LocalStorageService } from 'ngx-webstorage';
import { catchError, tap } from 'rxjs/operators';

import { Role } from './user.service';
import { NavigationService } from './navigation.service';
import { CheckPermissionService, ErrorsService } from '../shared/services';

@Injectable()
export class AuthService {
  public loginWithTokenEndpoint: string;
  public refreshTokenEndpoint = '/token/refresh/';

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

  public refreshJWTToken(user) {
    const { refresh_token = '' } = { ...user };
    return this.http.post(this.refreshTokenEndpoint, { refresh: refresh_token })
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
