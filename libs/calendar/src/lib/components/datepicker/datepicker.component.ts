import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { DateRangeService, DatepickerService } from '../../services';
import { DateRange, filterDateFormat } from '@webui/utilities';
import { Moment } from '@webui/time';
import { IDateRange } from '../../models';

@Component({
  selector: 'webui-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  @Input() type!: DateRange;
  @Input() date!: Moment;
  @Input() range?: IDateRange;

  @Output() update = new EventEmitter();

  dateRange = DateRange;
  showCustomWeek = false;

  rangeTitle!: string;
  yearBody: any;
  monthBody: any;
  activeDates!: string[];

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

    this.setActiveDates(this.date, this.range);
  }

  public setActiveDates(from: Moment, range?: IDateRange) {
    range = range || this.datepickerService.getRangeDates(from, DateRange.Week);
    this.activeDates = [];
    const day = range.start.clone();

    while (day.isBefore(range.end)) {
      this.activeDates.push(day.format(filterDateFormat));
      day.add(1, DateRange.Day);
    }
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
    this.update.emit(date);
  }

  public isActiveDay(day: any) {
    return this.activeDates.indexOf(day.date) > -1;
  }

  public isFirstActiveDay(day: any) {
    return this.activeDates.indexOf(day.date) === 0;
  }

  public isLastActiveDay(day: any) {
    return this.activeDates.indexOf(day.date) === this.activeDates.length - 1;
  }

  public showCustomWeekCalendar(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.showCustomWeek = true;
  }

  public setCustomWeek(date: Moment) {
    this.update.emit({
      start: date.clone(),
      end: date.clone().add(1, DateRange.Week),
    });
  }

  private generateYearCalendar() {
    this.yearBody = this.datepickerService.generateYear(this.date, (body) => {
      return body.map((row) => {
        return row.map((month) => {
          return {
            ...month,
            active: month.month === this.date.month(),
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
          };
        });
      });
    });
  }
}
