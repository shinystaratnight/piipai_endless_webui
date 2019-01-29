import { Injectable } from '@angular/core';

import { Moment } from 'moment-timezone';

import { rangeFormats, DateRange } from '../../helpers';

@Injectable()
export class DateRangeService {

  getRangeDates(date: Moment, type: DateRange): { start: Moment, end: Moment } {
    return {
      start: date.clone().startOf(type),
      end: date.clone().endOf(type)
    };
  }

  nextRange(date: Moment, type: DateRange) {
    return this.updateDate(date, type, 1);
  }

  previousRange(date: Moment, type: DateRange) {
    return this.updateDate(date, type, -1);
  }

  getRangeTitle(date: Moment, type: DateRange) {
    if (type === DateRange.Week) {
      const start = date.clone().weekday(0);
      const end = date.clone().weekday(6);

      return `${start.format(rangeFormats[type])} - ${end.format(rangeFormats[type])}`;
    }

    return date.format(rangeFormats[type]);
  }

  isYearRange(type: DateRange) {
    return type === DateRange.Year;
  }

  isMonthRange(type: DateRange) {
    return type === DateRange.Month;
  }

  isWeekRange(type: DateRange) {
    return type === DateRange.Week;
  }

  isDayRange(type: DateRange) {
    return type === DateRange.Day;
  }

  private updateDate(date: Moment, type: DateRange, range) {
    return date.add(range, type);
  }
}
