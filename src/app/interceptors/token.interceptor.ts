import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private storage: LocalStorageService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.storage.retrieve('user');
    let apiReq = req;

    if (user) {
      apiReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
    }

    return next.handle(apiReq);
  }
}
