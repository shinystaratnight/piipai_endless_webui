import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Moment } from 'moment-timezone';

import { DateRangeService } from '../../services';
import { DateRange } from '../../../helpers';

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

  get isYearRange() {
    return this.dateRangeService.isYearRange(this.type);
  }

  get isMonthRange() {
    return this.dateRangeService.isMonthRange(this.type);
  }

  get isWeekRange() {
    return this.dateRangeService.isWeekRange(this.type);
  }

  get isDayRange() {
    return this.dateRangeService.isDayRange(this.type);
  }

  constructor(
    private dateRangeService: DateRangeService
  ) {}

  ngOnInit() {
    this.fillCalendar();
  }

  fillCalendar() {
    switch (this.type) {
      case DateRange.Year:
        this.generateYearCalendar();
        break;
    }
  }

  changeCalendar(date: Moment) {
    this.date = date;

    this.fillCalendar();
  }

  changeDate(date: Moment) {
    this.change.emit(date);
  }

  generateYearCalendar() {
    const range = this.dateRangeService.getRangeDates(this.date, DateRange.Year);

    const body = [];
    let row;

    const currentDay = range.start.clone();
    while (currentDay.isBefore(range.end)) {
      if (currentDay.month() % 3 === 0) {
        row = [];
        body.push(row);
      }

      row.push({
        label: currentDay.format('MMMM'),
        date: currentDay.clone(),
        active: currentDay.month() === this.date.month()
      });

      currentDay.add(1, DateRange.Month);
    }

    this.yearBody = body;
  }

}
