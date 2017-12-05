import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ErrorsService {

  public messages = new BehaviorSubject('');

  public parseErrors(error: Response, close = false) {
    if (error.status === 403) {
      let body = error.json();
      this.messages.next(body.errors.detail);
      return  Observable.throw(error.json());
    }
    if (!close) {
      return Observable.throw(error.json());
    } else {
      return Observable.of([]);
    }
  }

}
