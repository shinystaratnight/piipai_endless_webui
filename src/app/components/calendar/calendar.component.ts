import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as moment from 'moment-timezone';

import { CalendarService, Range, CalendarData } from './calendar.service';
import { CalendarDataService } from './calendar-data.service';
import { filters } from './calendar-filters.meta';

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
  public filters = filters;
  public topHeight: any;

  @ViewChild('filter')
  public filter: ElementRef;

  private client: string;
  private candidate: string;
  public status = {
    hideAutocomplete: true,
    displayValue(data) {
      return Object.keys(data).filter((key) => data[key]).length;
    },
    data: {
      0: false,
      1: false,
      2: false,
    }
  };
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

        this.changeCalendar(value);
      });

    this.currentRange.patchValue(Range.Month);
  }

  changeRange(increment: boolean) {
    const rangeType = this.currentRange.value;
    this.currentDate = this.updateDate(this.currentDate, rangeType, increment);

    this.changeCalendar(rangeType);
  }

  changeQuery(event?) {
    if (event) {
      this[event.key] = event.value.data;
    }

    this.changeCalendar();
  }

  openAutocomplete(event) {
    const target = event.target;
    this.status.hideAutocomplete = !this.status.hideAutocomplete;

    if (target.classList.contains('autocomplete-value')) {
      this.topHeight = target.offsetHeight + 1;
    }
  }

  private changeCalendar(type?: Range) {
    const rangeType = type || this.currentRange.value;

    const range = this.calendar.getRangeDates(this.currentDate, rangeType);
    const query = this.generateQuery(range.start, range.end, this.client, this.candidate);

    this.getShifts(query, rangeType);
  }

  private getShifts(query: any, range: Range) {
    this.data.getShiftsByQuery(query).subscribe((data) => {
      this.prepareData(data);

      this.updateCalendar(this.currentDate, range);
    });
  }

  private generateQuery(from: any, to: any, client?, candidate?) {
    const filterList = {
      ['date__shift_date_0']: from.format(this.calendar.filterFormat),
      ['date__shift_date_1']: to.format(this.calendar.filterFormat),
      fields: ['id', 'date', 'is_fulfilled', 'workers_details'],
      limit: -1,
    };

    if (client) {
      filterList['client'] = client;
    }

    if (candidate) {
      filterList['candidate'] = candidate;
    }

    return filterList;
  }

  private prepareData(data) {
    this.shifts = [];

    if (data.results.length) {
      const filteredData = data.results.filter((shift) => this.status.data[shift.is_fulfilled]);

      if (filteredData.length) {
        this.shifts = filteredData
          .map((shift) => {
            return {
              date: shift.date.shift_date,
              time: shift.time,
              jobsite: shift.date.job.jobsite.name,
              position: shift.date.job.position.name,
              is_fulfilled: shift.is_fulfilled,
              candidates: shift.workers_details,
            };
          });
      }
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

  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.filter.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.status.hideAutocomplete = true;
    }
  }
}
