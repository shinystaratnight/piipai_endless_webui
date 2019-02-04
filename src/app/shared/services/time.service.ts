import { Injectable } from '@angular/core';

import * as moment from 'moment-timezone';
moment.tz.setDefault('Australia/Sydney');

moment.updateLocale('en', {
  week: {
    dow : 1, // Monday is the first day of the week.
  } as any
});
moment.locale('en');

@Injectable()
export class TimeService {

  get instance() {
    return moment;
  }

  public getToday() {
    return moment();
  }
}
