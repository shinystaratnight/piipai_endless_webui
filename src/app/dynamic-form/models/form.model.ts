import { Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let counter = 0;

export class Form {

  public allowMethods: string[];

  private _mode: BehaviorSubject<string>;
  get mode() {
    return this._mode.asObservable();
  }

  private _id = counter++;
  get id() {
    return this._id;
  }

  private endpoint: string;

  constructor(endpoint: string, mode: string, allowMethods: string[]) {
    this._mode = new BehaviorSubject(mode);
    this.endpoint = endpoint;
    this.allowMethods = allowMethods;
  }

  public changeMode(mode: string) {
    this._mode.next(mode);
  }

}
