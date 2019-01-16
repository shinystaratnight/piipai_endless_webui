import { Injectable } from '@angular/core';

import { TimeService } from '../../services/time.service';
import { Moment } from 'moment-timezone';

export enum Range { Month = 'month', Week = 'week', Day = 'day' }
export enum ShiftStatus { Unfilled, Filled, Pending }

export interface CalendarData {
  header: string[];
  body: any[];
}

@Injectable()
export class CalendarService {
  public filterFormat = 'YYYY-MM-DD';
  public calendarTimes = [
    '00:00 AM',
    '3:00',
    '6:00 AM',
    '9:00',
    '12:00 PM',
    '15:00',
    '18:00 PM',
    '21:00',
    '23:59 PM'
  ];

  private rangeFormat = {
    month: 'MMMM YYYY',
    week: 'MMM D',
    day: 'D MMMM YYYY',
  };

  private headerFormat = {
    month: 'ddd',
    week: 'ddd / D MMM',
    day: 'D MMMM YYYY / dddd',
  };

  private calendarHeight = 370;

  constructor(
    private time: TimeService
  ) {}

  public getRangeFormatDate(date: Moment, type: Range) {
    if (type === Range.Week) {
      const start = date.clone().weekday(0);
      const end = date.clone().weekday(6);

      return `${start.format(this.rangeFormat[type])} - ${end.format(this.rangeFormat[type])}`;
    }

    return date.format(this.rangeFormat[type]);
  }

  public generateMonth(from: Moment, data: any): CalendarData {
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
      const newData = data.filter((el) => el.date === date);

      row.push({
        date,
        data: newData,
        label: currentDay.format('D'),
        tooltip: this.generateTooltipForMonth(newData),
        isOpen: false,
        today: currentDay.format(this.filterFormat) === this.getToday().format(this.filterFormat)
      });

      currentDay.add(1, 'day');
    }

    return {
      header,
      body,
    };
  }

  public generateWeek(from: Moment, data: any) {
    const header = this.getHeader(Range.Week, from);

    const range = this.getRangeDates(from, Range.Week);
    const body = [];

    const currentDay = range.start.clone();
    while (currentDay.isBefore(range.end)) {

      const date = currentDay.format(this.filterFormat);
      const newData = data.filter((el) => el.date === date);

      body.push({
        date,
        data: newData,
        isOpen: false,
      });

      currentDay.add(1, 'day');
    }

    return {
      header,
      body,
      lines: this.calculateLines()
    };
  }

  public generateDay(from: Moment) {
    const header = this.getHeader(Range.Day, from);

    return {
      header
    };
  }

  getRangeDates(date: Moment, type: Range): { start: Moment, end: Moment } {
    return {
      start: date.clone().startOf(type),
      end: date.clone().endOf(type)
    };
  }

  getToday() {
    return this.time.getToday();
  }

  calculateShiftSize(start: string) {
    const timesheetTime = 8.5;
    const startMoment = this.time.instance(start, 'hh:mm:ss');

    const time = {
      hours: startMoment.hour(),
      monite: startMoment.minute(),
    };

    return {
      top: Math.round((this.calendarHeight / 24) * time.hours) + 'px',
      height: Math.round((this.calendarHeight / 24) * timesheetTime) + 'px'
    };
  }

  calculateTimes() {
    return this.calendarTimes.map((time, i, arr) => {
      const result = {};
      if (i === 0) {
        result['top'] = 0;
        result['bottom'] = 'auto';
      }

      if (i === (arr.length - 1)) {
        result['top'] = 'auto';
        result['bottom'] = 0;
      }

      return {
        time,
        top: (this.calendarHeight / 8) * i - 6,
        ...result
      };
    });
  }

  calculateLines() {
    return this.calendarTimes.map((time, i) => {
      return {
        top: (this.calendarHeight / 8) * i,
        class: (i % 2 !== 0) ? 'dotted' : ''
      };
    });
  }

  private generateTooltipForMonth(data: any[]) {
    if (data.length) {
      const result = {
        [ShiftStatus.Unfilled]: [],
        [ShiftStatus.Filled]: [],
        [ShiftStatus.Pending]: []
      };

      data.forEach((shift) => {
        result[shift.is_fulfilled].push(shift);
      });

      return result;
    }
  }

  private getHeader(type: Range, from: Moment): string[] {
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
