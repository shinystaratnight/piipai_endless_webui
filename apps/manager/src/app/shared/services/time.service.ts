import { Injectable } from '@angular/core';

import * as moment from 'moment-timezone';
import { timeZone } from '../../helpers';
moment.tz.setDefault(timeZone);

moment.updateLocale('en', {
  week: {
    dow : 1, // Monday is the first day of the week.
  } as any
});
moment.locale('en');

@Injectable()
export class TimeService {

  static instance = moment;

  get instance() {
    return moment;
  }

  public getToday() {
    return moment();
  }
}
