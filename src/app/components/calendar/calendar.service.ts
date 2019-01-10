import { Injectable } from '@angular/core';

import * as moment from 'moment-timezone';

export enum Range { Month = 'month', Week = 'week', Day = 'day' }

export interface CalendarData {
  header: string[];
  body: any[];
}

@Injectable()
export class CalendarService {
  public filterFormat = 'YYYY-MM-DD';

  private rangeFormat = {
    month: 'MMMM YYYY',
    week: 'MMM Do',
    day: 'D MMMM YYYY',
  };

  private headerFormat = {
    month: 'ddd',
    week: 'ddd / D MMM',
    day: 'D MMMM YYYY / dddd',
  };

  public getRangeFormatDate(date: any, type: Range) {
    if (type === Range.Week) {
      const start = date.clone().weekday(0);
      const end = date.clone().weekday(6);

      return `${start.format(this.rangeFormat[type])} - ${end.format(this.rangeFormat[type])}`;
    }

    return date.format(this.rangeFormat[type]);
  }

  public generateMonth(from: any, data: any): CalendarData {
    const header = this.getHeader(Range.Month, from);

    const range = this.getRangeDates(from, Range.Month);
    const firstDay = range.start.weekday(0);
    const lastDay = range.end.weekday(6);
    const body = [];
    let row;

    const currentDay = firstDay.clone();
    while (currentDay.isBefore(lastDay)) {
      if (currentDay.day() === 0) {
        row = [];
        body.push(row);
      }

      const date = currentDay.format(this.filterFormat);

      row.push({
        date,
        label: currentDay.format('D'),
        data: data.find((el) => el.date === date)
      });

        currentDay.add(1, 'day');
    }

    return {
      header,
      body,
    };
  }

  public generateWeek(from: any) {
    const header = this.getHeader(Range.Week, from);

    return {
      header
    };
  }

  public generateDay(from: any) {
    const header = this.getHeader(Range.Day, from);

    return {
      header
    };
  }

  getRangeDates(date: any, type: Range): { start: any, end: any } {
    return {
      start: date.clone().startOf(type),
      end: date.clone().endOf(type)
    };
  }

  getToday() {
    return moment().tz('Australia/Sydney');
  }

  private getHeader(type: Range, from: any): string[] {
    const result = [];
    if (type !== Range.Day) {

      for (let day = 0; day < 7; day++) {
        result.push(from.clone().weekday(day).format(this.headerFormat[type]));
      }
    } else {
      result.push(from.clone().format(this.headerFormat[type]));
    }

    return result;
  }

}
