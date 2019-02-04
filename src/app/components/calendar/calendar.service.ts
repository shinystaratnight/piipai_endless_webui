import { Injectable } from '@angular/core';

import { Moment } from 'moment-timezone';

import { DateRange, rangeFormats, weekEnd, weekStart } from '../../helpers';
import { DatepickerService } from '../../shared/services';
import { TimeService } from '../../shared/services';


export enum ShiftStatus { Unfilled, Filled, Pending }

export interface CalendarData {
  header: string[];
  body: any;
}

@Injectable()
export class CalendarService {
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

  private calendarHeight = 370;

  constructor(
    private time: TimeService,
    private datepickerService: DatepickerService
  ) {}

  public getRangeFormatDate(date: Moment, type: DateRange) {
    if (type === DateRange.Week) {
      const start = date.clone().weekday(weekStart);
      const end = date.clone().weekday(weekEnd);

      return `${start.format(rangeFormats[type])} - ${end.format(rangeFormats[type])}`;
    }

    return date.format(rangeFormats[type]);
  }

  public generateMonth(from: Moment, data: any): CalendarData {
    return this.datepickerService.generateMonth(from, (body) => {
      return body.map((row) => {
        return row.map((day) => {
          const newData = data.filter((el) => el.date === day.date);
          return {
            ...day,
            data: newData,
            tooltip: this.generateTooltipForMonth(newData),
            isOpen: false,
          };
        });
      });
    });
  }

  public generateWeek(from: Moment, data: any) {
    return this.datepickerService.generateWeek(from, (body) => {
      return body.map((day) => {
        const newData = data.filter((el) => el.date === day.date);
        return {
          ...day,
          data: newData,
          tooltip: this.generateTooltipForMonth(newData),
          isOpen: false,
          lines: this.calculateLines(),
        };
      });
    });
  }

  public generateDay(from: Moment, data: any) {
    return this.datepickerService.generateDay(from, (body) => {
      return {
        ...body,
        data: data.filter((el) => el.date === body.date),
        isOpen: false,
        lines: this.calculateLines()
      };
    });
  }

  getRangeDates(date: Moment, type: DateRange): { start: Moment, end: Moment } {
    return this.datepickerService.getRangeDates(date, type);
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
}
