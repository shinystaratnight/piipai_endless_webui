import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { Endpoints } from '../metadata/helpers';
import { tap } from 'rxjs/operators';

export const updateGuide: Subject<any> = new Subject();
const methods = ['DELETE', 'POST', 'PUT'];
const guideEndpoints = [
  Endpoints.Company,
  Endpoints.CompanyAddress,
  Endpoints.CompanyContactRelationship,
  Endpoints.Industry,
  Endpoints.CandidateContact,
  Endpoints.Skill,
  Endpoints.Jobsite
]

@Injectable()
export class MasterGuideInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const method = req.method;
    const include = guideEndpoints.some((el) => req.url.includes(el));

    return next.handle(req).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.ok && methods.includes(method) && include) {
          updateGuide.next(true);
        }
      })
    );
  }
}
