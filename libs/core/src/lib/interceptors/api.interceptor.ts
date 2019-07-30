import { Injectable, Inject, Optional } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ENV } from '../services';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(
    @Optional() @Inject(ENV) private env: any
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiReq = req.clone({ url: `${this.env.api}${req.url}` });
    return next.handle(apiReq);
  }
}
