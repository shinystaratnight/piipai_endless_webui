import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Moment } from 'moment-timezone';

import { DateRangeService, DatepickerService } from '../../services';
import { DateRange, filterDateFormat } from '../../../helpers';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

  @Input() type: DateRange;
  @Input() date: Moment;

  @Output() change = new EventEmitter();

  dateRange = DateRange;

  rangeTitle: string;
  yearBody: any;
  monthBody: any;

  get isYearRange() {
    return this.dateRangeService.isYearRange(this.type);
  }

  get isWeekRange() {
    return this.dateRangeService.isWeekRange(this.type);
  }

  get isDayRange() {
    return this.dateRangeService.isDayRange(this.type);
  }

  constructor(
    private dateRangeService: DateRangeService,
    private datepickerService: DatepickerService
  ) {}

  public ngOnInit() {
    this.fillCalendar();
  }

  public fillCalendar() {
    switch (this.type) {
      case DateRange.Year:
        this.generateYearCalendar();
        break;

      case DateRange.Week:
        this.generateMonthCalendar();
        break;

      case DateRange.Day:
        this.generateMonthCalendar();
        break;
    }
  }

  public changeCalendar(date: Moment) {
    this.date = date;

    this.fillCalendar();
  }

  public changeDate(date: Moment) {
    this.change.emit(date);
  }

  public isActiveWeek(week: any[]) {
    if (week) {
      return week.some((day) => day.active);
    }
  }

  private generateYearCalendar() {
    this.yearBody = this.datepickerService.generateYear(this.date, (body) => {
      return body.map((row) => {
        return row.map((month) => {
          return {
            ...month,
            active: month.month === this.date.month()
          };
        });
      });
    });
  }

  private generateMonthCalendar() {
    this.monthBody = this.datepickerService.generateMonth(this.date, (body) => {
      return body.map((week) => {
        return week.map((day) => {
          return {
            ...day,
            currentMonth: day.month === this.date.month(),
            active: day.date === this.date.format(filterDateFormat)
          };
        });
      });
    });
  }

}
