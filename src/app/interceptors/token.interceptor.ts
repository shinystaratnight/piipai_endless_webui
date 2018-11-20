import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LocalStorageService } from 'ngx-webstorage';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private storage: LocalStorageService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.storage.retrieve('user');

    if (user && !this.isRefresh(req.url)) {
      const helper = new JwtHelperService();
      const tokenIsExpired = helper.isTokenExpired(user.access_token);

      if (tokenIsExpired && user.rememberMe) {
        const refreshTokenIsExpired = helper.isTokenExpired(user.refresh_token);

        if (refreshTokenIsExpired) {
          this.authService.logout();
        } else {
          return this.authService.refreshJWTToken(user)
            .pipe(
              switchMap((res) => {
                return next.handle(this.createRequest(req, this.storage.retrieve('user')));
              })
            );
        }
      } else if (user) {
        return next.handle(this.createRequest(req, user));
      }
    } else {
      return next.handle(req);
    }
  }

  createRequest(request, user) {
    if (!user) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
  }

  isRefresh(url: string) {
    return url.includes('/token/refresh/');
  }
}
