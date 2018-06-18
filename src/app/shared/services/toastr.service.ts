import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface Message {
  message: string;
  type: string;
}

export const MessageType = {
  success: 'success',
  error: 'error'
};

@Injectable()
export class ToastrService {

  private _messages: BehaviorSubject<Message>;

  get message(): Observable<Message> {
    return this._messages.asObservable().skip(1);
  }

  constructor() {
    this._messages = new BehaviorSubject(null);
  }

  public sendMessage(message: string, type: string) {
    this._messages.next({ message, type });
  }

}