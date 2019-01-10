import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as moment from 'moment-timezone';

import { CalendarService, Range, CalendarData } from './calendar.service';
import { CalendarDataService } from './calendar-data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  public range = Range;
  public currentRange: FormControl;
  public rangeTitle: string;
  public calendarData: CalendarData;
  public shifts: any;

  private currentDate: any;


  constructor(
    private calendar: CalendarService,
    private data: CalendarDataService
  ) {}

  get isMonthRange() {
    return this.currentRange.value === Range.Month;
  }

  get isWeekRange() {
    return this.currentRange.value === Range.Week;
  }

  get isDayRange() {
    return this.currentRange.value === Range.Day;
  }

  ngOnInit() {
    this.currentDate = this.calendar.getToday();
    this.currentRange = new FormControl('');

    this.currentRange.valueChanges
      .subscribe((value: Range) => {
        this.currentDate = this.calendar.getToday();

        this.updateCalendar(this.currentDate, value);
      });

    this.data.getShiftsByDate(this.currentDate.format(this.calendar.filterFormat), null).subscribe(
      (data) => {
        this.prepareData(data);
        this.currentRange.patchValue(Range.Month);
      }
    );
  }

  private prepareData(data) {
    if (data.results.length) {
      this.shifts = data.results.map((shift) => {
        return {
          date: shift.date.shift_date,
          time: shift.time,
          name: shift.date.job.name,
          is_fulfilled: shift.is_fulfilled
        };
      });
    }
  }

  private generateCalendar(date, type: Range) {
    let calendarData;

    switch (type) {
      case Range.Month:
        calendarData = this.calendar.generateMonth(date, this.shifts);
        break;
      case Range.Week:
        calendarData = this.calendar.generateWeek(date);
        break;
      case Range.Day:
        calendarData = this.calendar.generateDay(date);
        break;

      default:
        break;
    }

    this.calendarData = calendarData;
  }

  changeRange(increment: boolean) {
    this.currentDate = this.updateDate(this.currentDate, this.currentRange.value, increment);

    this.updateCalendar(this.currentDate, this.currentRange.value);
  }

  private updateCalendar(date: any, type: Range) {
    this.updateCalendarHeader(date, type);
    this.generateCalendar(date, type);
  }

  private updateCalendarHeader(date: any, type: Range) {
    this.rangeTitle = this.calendar.getRangeFormatDate(date, type);
  }

  private updateDate(date: any, type: Range, increment: boolean) {
    return increment ? date.add(1, type) : date.add(-1, type);
  }
}
