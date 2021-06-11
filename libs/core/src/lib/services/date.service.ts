import { Injectable } from '@angular/core';

import * as moment from 'moment-timezone';
import { Moment } from 'moment';

moment.updateLocale('en', {
  week: {
    dow: 1 // Monday is the first day of the week.
  } as any
});

export type DateInstance = moment.Moment;

export enum Format {
  Date = 'DD/MM/YYYY',
  DateTime = 'DD/MM/YYYY hh:mm A',
  Time = 'hh:mm A'
}

export enum FormatApi {
  Date = 'YYYY-MM-DD'
}

@Injectable({
  providedIn: 'root'
})
export class DateService {
  get instance(): any {
    return moment;
  }

  public parse(date: string, timezone?: string, format?: string): DateInstance {
    return this.instance.tz(date, format, timezone);
  }

  public format(instance: DateInstance, format: string): string {
    return instance.format(format);
  }

  public getTime(instance: DateInstance): string {
    return instance.format(Format.Time);
  }

  public getDate(instance: DateInstance): string {
    return instance.format(Format.Date);
  }

  public getDateTime(instance: DateInstance): string {
    return instance.format(Format.DateTime);
  }

  public getUtc(instance: DateInstance): string {
    return instance.utc().format();
  }
}
