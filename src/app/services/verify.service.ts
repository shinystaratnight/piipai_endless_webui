import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class VerifyService {

  constructor(
    private http: Http
  ) {}

  public verifyEmail(endpoint) {
    return this.http
      .get(endpoint)
      .pipe(
        map((res: Response) => res.json && res.json()),
        catchError((err: any) => throwError(err))
      );
  }
}
