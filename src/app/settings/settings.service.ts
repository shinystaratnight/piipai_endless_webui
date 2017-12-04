import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SettingsService {

  public _url: BehaviorSubject<any>;

  constructor() {
    this._url = new BehaviorSubject([]);
  }

  get url() {
    return this._url;
  }

  set url(value) {
    this._url.next(value);
  }
}
