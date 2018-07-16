import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { ToastrService, MessageType } from './toastr.service';

@Injectable()
export class ErrorsService {

  constructor(
    private ts: ToastrService
  ) {}

  public parseErrors(error: Response, close = false) {
    if (error.status === 500) {
      this.ts.sendMessage(
        'Server error',
        MessageType.error
      );
    }

    if (error.status === 403) {
      let body = error.json();
      this.ts.sendMessage(
        body.errors.detail,
        MessageType.error
      );
      return Observable.throw(error.json && error.json());
    }
    if (!close) {
      return Observable.throw(error.json && error.json());
    } else {
      return Observable.of([]);
    }
  }

}
