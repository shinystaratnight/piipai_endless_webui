import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as moment from 'moment-timezone';

enum Range { Month = 'month', Week = 'week', Day = 'day' }

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  public range = Range;
  public currentRange: FormControl;
  private currentDate: any;

  public rangeTitle: string;

  ngOnInit() {
    this.currentRange = new FormControl(Range.Month);
    this.currentRange.valueChanges.subscribe((value: Range) => {
      this.getCurrentRangeLabel(value);
    });
    this.currentRange.patchValue(Range.Month);
  }

  getCurrentRangeLabel(type: Range, date?: string) {
    switch (type) {
      case Range.Month:
        this.generateMonth(date);
        break;
      case Range.Week:
        this.generateWeek(date);
        break;
      case Range.Day:
        this.generateDay(date);
        break;

      default:
        break;
    }
  }

  changeRange(increment: boolean) {
    const newDate = this.updateDate(this.currentDate, this.currentRange.value, increment);

    this.getCurrentRangeLabel(this.currentRange.value, newDate);
  }


  private generateMonth(date?: string) {
    this.currentDate = date || this.getNow();
    this.rangeTitle = this.currentDate.format('MMMM YYYY');

  }

  private generateWeek(date?: string) {
    this.currentDate = date || this.getNow();

    const start = this.currentDate.clone().weekday(0);
    const end = this.currentDate.clone().weekday(6);

    this.rangeTitle = `${start.format('MMM Do')} - ${end.format('MMM Do')}`;
  }

  private generateDay(date?: any) {
    this.currentDate = date || this.getNow();

    this.rangeTitle = this.currentDate.format('MMMM Do YYYY');
  }

  private getNow() {
    return moment().tz('Australia/Sydney');
  }

  private updateDate(date: any, type: Range, increment: boolean) {
    return increment ? date.add(1, type) : date.add(-1, type);
  }

  private resetRangeDates(type: Range) {

  }
}
