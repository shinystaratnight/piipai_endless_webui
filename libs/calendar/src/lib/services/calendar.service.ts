import { Injectable } from '@angular/core';

import { Moment } from 'moment-timezone';

import { DateRange, rangeFormats, weekEnd, weekStart, getToday, getTimeInstance } from '@webui/utilities';
import { DatepickerService } from './datepicker.service';

export enum Status { Unfilled, Fullfilled, Pending, Open, Filled, Approved }

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
    private datepickerService: DatepickerService
  ) {}

  public getRangeFormatDate(date: Moment, type: DateRange, range?: { start: Moment, end: Moment }) {
    if (type === DateRange.Week) {
      const start = (range && range.start) || date.clone().weekday(weekStart);
      const end = (range && range.end) || date.clone().weekday(weekEnd);

      return `${start.format(rangeFormats[type])} - ${end.format(rangeFormats[type])}`;
    }

    return date.format(rangeFormats[type]);
  }

  public generateMonth(from: Moment, data: any): CalendarData {
    return this.datepickerService.generateMonth(from, (body) => {
      return body.map((row) => {
        return row.map((day) => {
          const newData = data.filter((el) => el.date === day.date);
          const availabilityData = data.find((el) => el.target_date === day.date);
          return {
            ...day,
            data: newData,
            jobOffers: newData.filter((el) => el.showButtons),
            available: availabilityData ? availabilityData.confirmed_available : undefined,
            availableId: availabilityData ? availabilityData.id : undefined,
            tooltip: this.generateTooltipForMonth(newData),
            isOpen: false,
          };
        });
      });
    });
  }

  public generateWeek(from: Moment, data: any, range?: { start: Moment, end: Moment }) {
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
    }, range);
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
    return getToday();
  }

  calculateShiftSize(start: string) {
    const timesheetTime = 8.5;
    const startMoment = getTimeInstance()(start, 'hh:mm:ss');

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
        [Status.Unfilled]: [],
        [Status.Fullfilled]: [],
        [Status.Pending]: [],
        [Status.Open]: [],
        [Status.Filled]: [],
        [Status.Approved]: []
      };

      data.forEach((shift) => {
        if (Number.isInteger(shift.is_fulfilled)) {
          result[shift.is_fulfilled].push(shift);
        }

        if (shift.timesheetStatus) {
          result[shift.timesheetStatus].push(shift);
        }
      });

      return result;
    }
  }
}
