import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface Message {
  message: string;
  type: MessageType;
}

export enum MessageType {
  Success = 'success',
  Error = 'error'
}

@Injectable()
export class ToastrService {

  private _messages: BehaviorSubject<Message>;

  get message(): Observable<Message> {
    return this._messages.asObservable().skip(1);
  }

  constructor() {
    this._messages = new BehaviorSubject(null);
  }

  public sendMessage(message: string, type: MessageType) {
    this._messages.next({ message, type });
  }

}
