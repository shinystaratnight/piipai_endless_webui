import { Injectable } from '@angular/core';

import * as moment from 'moment-timezone';
moment.tz.setDefault('Australia/Sydney');

@Injectable()
export class TimeService {

  get instance() {
    return moment;
  }

  public getToday() {
    return moment();
  }
}
