import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

export interface Message {
  text: string;
  type: MessageType;
}

export enum MessageType {
  Success = 'success',
  Error = 'error',
  Info = 'info'
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _messages: BehaviorSubject<Message> = new BehaviorSubject(
    {} as Message
  );

  get message$(): Observable<Message> {
    return this._messages.asObservable().pipe(skip(1));
  }

  public sendMessage(text: string, type: MessageType) {
    const data: Message = { text, type };

    this._messages.next(data);
  }
}
