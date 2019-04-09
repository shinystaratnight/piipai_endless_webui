import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class VerifyService {

  constructor(
    private http: HttpClient
  ) {}

  public verifyEmail(endpoint) {
    return this.http
      .get(endpoint)
      .pipe(
        catchError((err: any) => throwError(err))
      );
  }
}
