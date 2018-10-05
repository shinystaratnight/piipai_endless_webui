import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { of, throwError } from 'rxjs';

import { ToastService, MessageType } from './toast.service';

@Injectable()
export class ErrorsService {

  constructor(
    private ts: ToastService
  ) {}

  public parseErrors(error: Response, close = false) {
    if (error.status === 500) {
      this.ts.sendMessage(
        'Server error',
        MessageType.error
      );
    }

    if (error.status === 403) {
      const body = error.json();
      this.ts.sendMessage(
        body.errors.detail,
        MessageType.error
      );
      return throwError(error.json && error.json());
    }
    if (!close) {
      return throwError(error.json && error.json());
    } else {
      return of([]);
    }
  }

}
