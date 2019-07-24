import { Injectable } from '@angular/core';
import { Moment } from 'moment-timezone';

import { DateRange, filterDateFormat, weekStart, weekEnd } from '@webui/utilities';
import { TimeService } from './time.service';

export interface DatepickerData {
  header: string[];
  body: any;
}

@Injectable()
export class DatepickerService {

  private headerFormat = {
    month: 'ddd',
    week: 'ddd / D MMM',
    day: 'D MMMM YYYY / dddd',
  };

  constructor(private timeService: TimeService) {}

  public generateYear(from: Moment, updateBody?: Function) {
    const range = this.getRangeDates(from, DateRange.Year);

    let body = [];
    let row;

    const currentMonth = range.start.clone();
    while (currentMonth.isBefore(range.end)) {
      if (currentMonth.month() % 3 === 0) {
        row = [];
        body.push(row);
      }

      row.push({
        label: currentMonth.format('MMMM'),
        date: currentMonth.clone(),
        month: currentMonth.month()
      });

      currentMonth.add(1, DateRange.Month);
    }

    if (updateBody) {
      body = updateBody(body);
    }

    return body;
  }

  public generateMonth(from: Moment, updateBody?: Function): DatepickerData {
    const range = this.getRangeDates(from, DateRange.Month);
    const firstDay = range.start.weekday(weekStart);
    const lastDay = range.end.weekday(weekEnd);
    let body = [];
    let row;

    const currentDay = firstDay.clone();
    while (currentDay.isBefore(lastDay)) {
      if (currentDay.day() === 1) {
        row = [];
        body.push(row);
      }

      const date = currentDay.format(filterDateFormat);

      row.push({
        date,
        month: currentDay.month(),
        dateMoment: currentDay.clone(),
        label: currentDay.format('D'),
        today: date === this.timeService.getToday().format(filterDateFormat)
      });

      currentDay.add(1, 'day');
    }

    if (updateBody) {
      body = updateBody(body);
    }

    return {
      header: this.getHeader(DateRange.Month, from),
      body,
    };
  }

  public generateWeek(from: Moment, updateBody?: Function, range?: { start: Moment, end: Moment }): DatepickerData {
    range = range || this.getRangeDates(from, DateRange.Week);
    let body = [];

    const currentDay = range.start.clone();
    while (currentDay.isBefore(range.end)) {

      const date = currentDay.format(filterDateFormat);

      body.push({
        date,
      });

      currentDay.add(1, 'day');
    }

    if (updateBody) {
      body = updateBody(body);
    }

    return {
      header: this.getHeader(DateRange.Week, from, range),
      body,
    };
  }

  public generateDay(from: Moment, updateBody?: Function): DatepickerData {
    const date = from.format(filterDateFormat);
    let body = { date };

    if (updateBody) {
      body = updateBody(body);
    }

    return {
      header: this.getHeader(DateRange.Day, from),
      body,
    };
  }

  public getRangeDates(date: Moment, type: DateRange): { start: Moment, end: Moment } {
    return {
      start: date.clone().startOf(type),
      end: date.clone().endOf(type)
    };
  }

  private getHeader(type: DateRange, from: Moment, range?: { start: Moment, end: Moment }): string[] {
    const result = [];

    let start = range && range.start.clone() || from;

    if (type !== DateRange.Day) {
      if (!range) {
        start = start.clone().weekday(weekStart);
      } else {
        start = start.clone();
      }

      for (let day = 0; day < 7; day++) {
        result.push(start.clone().add(day, DateRange.Day).format(this.headerFormat[type]));
      }
    } else {
      result.push(start.format(this.headerFormat[type]));
    }

    return result;
  }
}
