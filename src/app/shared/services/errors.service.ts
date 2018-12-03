import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { of, throwError } from 'rxjs';

import { ToastService, MessageType } from './toast.service';

@Injectable()
export class ErrorsService {

  constructor(
    private ts: ToastService
  ) {}

  public parseErrors(error: HttpErrorResponse, close = false) {
    if (error.status === 500) {
      this.ts.sendMessage(
        'Server error',
        MessageType.error
      );
    }

    if (error.status === 403) {
      this.ts.sendMessage(
        error.error.errors.detail,
        MessageType.error
      );
      return throwError(error);
    }

    if (!close) {
      return throwError(error);
    } else {
      return of([]);
    }
  }

}
