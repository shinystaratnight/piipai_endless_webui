import { Injectable } from '@angular/core';
import { Time } from '@webui/time';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  public parse = Time.parse;
  public now = Time.now;
}
