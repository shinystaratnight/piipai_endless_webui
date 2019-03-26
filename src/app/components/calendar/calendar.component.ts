import { Component, Input, OnInit, HostListener, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Moment } from 'moment-timezone';

import { CalendarService, CalendarData } from './calendar.service';
import { DateRange, filterDateFormat } from '../../helpers';
import { FormatString } from '../../helpers/format';
import { CalendarDataService } from './calendar-data.service';
import { filters } from './calendar-filters.meta';
import { TimeService } from '../../shared/services';

import { DatepickerComponent } from '../../shared/components/datepicker/datepicker.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  public range = DateRange;
  public currentRange: FormControl;
  public rangeTitle: string;
  public calendarData: CalendarData;
  public shifts: any;
  public filters = filters;
  public topHeight: any;
  public calendarTimes: any[];
  public shiftStatus = {
    0: { color: 'bg-danger', key: 'cancelled' },
    1: { color: 'bg-success', key: 'accepted' },
    2: { color: 'bg-warning', key: 'undefined' },
  };
  public showClientFilter = true;
  public showCalendarDropdown: boolean;

  @Input()
  public client: string;

  @ViewChild('filter')
  public filter: ElementRef;

  @ViewChild(DatepickerComponent)
  public datepicker: ElementRef;

  @ViewChild('modal')
  public modal: TemplateRef<any>;

  private candidate: string;
  public status = {
    hideAutocomplete: true,
    displayValue(data) {
      return Object.keys(data).filter((key) => data[key]).length;
    },
    data: {
      0: true,
      1: true,
      2: true,
    }
  };
  public currentDate: Moment;
  public customRange: {start: Moment, end: Moment};
  public modalInfo: any;
  public saveProcess: boolean;

  public timesheetCounter = [
    {
      type: 1,
      count: 0,
      cssClass: 'text-success',
      text: 'Filled shifts'
    },
    {
      type: 0,
      count: 0,
      cssClass: 'text-danger',
      text: 'Unfilled shifts'
    },
    {
      type: 2,
      count: 0,
      cssClass: 'text-warning',
      text: 'Pending shifts'
    }
  ];

  private modalRef: NgbModalRef;
  private lastData: any;

  constructor(
    private calendar: CalendarService,
    private data: CalendarDataService,
    private modalService: NgbModal,
    private router: Router,
    private time: TimeService,
  ) {}

  get isMonthRange() {
    return this.currentRange.value === DateRange.Month;
  }

  get isWeekRange() {
    return this.currentRange.value === DateRange.Week;
  }

  get isDayRange() {
    return this.currentRange.value === DateRange.Day;
  }

  get rangeForDropdown() {
    if (this.currentRange.value === DateRange.Month) {
      return DateRange.Year;
    }

    return this.currentRange.value;
  }

  ngOnInit() {
    this.currentDate = this.calendar.getToday();
    this.currentRange = new FormControl('');
    this.calendarTimes = this.calendar.calculateTimes();

    if (this.client) {
      this.showClientFilter = false;
    }

    this.currentRange.valueChanges
      .subscribe((value: DateRange) => {
        this.calendarData = undefined;
        this.currentDate = this.calendar.getToday();

        this.changeCalendar(value);
      });

    this.currentRange.patchValue(DateRange.Month);
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  changeRange(increment: boolean) {
    this.customRange = undefined;
    const rangeType = this.currentRange.value;
    this.currentDate = this.updateDate(this.currentDate, rangeType, increment);

    this.changeCalendar(rangeType);
  }

  setDate(date: any) {
    this.showCalendarDropdown = false;

    if (date.start) {
      this.customRange = date;
      this.currentDate = date.start;
    } else {
      this.currentDate = date;
      this.customRange = undefined;
    }

    this.changeCalendar(this.currentRange.value);
  }

  changeQuery(event?) {
    if (event) {
      this[event.key] = event.value.data;
    }

    this.changeCalendar();
  }

  updateLayers() {
    this.prepareData(this.lastData);

    this.updateCalendar(this.currentDate, this.currentRange.value);
  }

  openAutocomplete(event) {
    const target = event.target;
    this.status.hideAutocomplete = !this.status.hideAutocomplete;

    if (target.classList.contains('autocomplete-value')) {
      this.topHeight = target.offsetHeight + 1;
    }
  }

  getColor(status: number) {
    return this.shiftStatus[status].color;
  }

  getStatus(status: number) {
    return this.shiftStatus[status].key;
  }

  openDropdown() {
    setTimeout(() => {
      this.showCalendarDropdown = true;
    }, 100);
  }

  public extendJob(data) {
    const formatString = new FormatString();

    this.modalInfo = {
      type: 'form',
      endpoint: `/hr/jobs/${data.shift.date.job.id}/extend/`,
      mode: 'edit',
      edit: true,
      data: {
        default_shift_starting_time: {
          action: 'add',
          data: {
            value: formatString.format(
              '{data.shift.date.job.time}',
              data
            )
          }
        },
        skill: {
          action: 'add',
          data: {
            value: formatString.format('{data.shift.date.job.position.id}', data)
          }
        },
        job: {
          action: 'add',
          data: {
            value: formatString.format('{data.shift.date.job.id}', data)
          }
        }
      }
    };

    this.modalRef = this.modalService.open(this.modal, { size: 'lg', windowClass: 'extend-modal' });
  }

  public fillInJob(data) {
    this.router.navigateByUrl(`/hr/jobs/${data.shift.date.job.id}/fillin`);
  }

  public formEvent(e, closeModal) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      this.saveProcess = false;
      closeModal();

      setTimeout(() => {
        this.changeCalendar();
      }, 1000);
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public fillinAccess(shift) {
    const statusSeccess = this.getStatus(shift.is_fulfilled) !== this.getStatus(1);
    const dateSuccess = this.calendar.getToday().isBefore(this.time.instance(shift.date).add(1, DateRange.Day));

    return statusSeccess && dateSuccess;
  }

  private changeCalendar(type?: DateRange) {
    const rangeType = type || this.currentRange.value;

    const range = this.customRange || this.calendar.getRangeDates(this.currentDate, rangeType);
    const query = this.generateQuery(range.start, range.end, this.client, this.candidate);

    this.getShifts(query, rangeType);
  }

  private getShifts(query: any, range: DateRange) {
    this.data.getShiftsByQuery(query).subscribe((data) => {
      this.prepareData(data);

      this.updateCalendar(this.currentDate, range);
    });
  }

  private generateQuery(from: Moment, to: Moment, client?, candidate?) {
    const filterList = {
      ['date__shift_date_0']: from.format(filterDateFormat),
      ['date__shift_date_1']: to.format(filterDateFormat),
      fields: ['id', 'date', 'is_fulfilled', 'workers_details', 'time'],
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
    this.lastData = data;

    if (data.results.length) {
      this.shifts = data.results
        .map((shift) => {
          return {
            shift,
            date: shift.date.shift_date,
            time: shift.time,
            jobsite: shift.date.job.jobsite.name,
            position: shift.date.job.position.name,
            is_fulfilled: this.getFulfilledStatus(shift.is_fulfilled, shift.workers_details),
            candidates: shift.workers_details,
            timesheet: this.calendar.calculateShiftSize(shift.time),
          };
        })
        .filter((shift) => this.status.data[shift.is_fulfilled]);

      this.timesheetCounter.forEach((el) => el.count = 0);
      this.shifts.forEach((shift) => {
        const target = this.timesheetCounter.find((counter) => counter.type === shift.is_fulfilled);
        target.count += 1;
      });
    }
  }

  private getFulfilledStatus(status: number, workers: any) {
    if (status === 1) {
      return status;
    }

    if (status === 0 && !workers.undefined.length) {
      return 0;
    }

    if (status === 0 && workers.undefined.length) {
      return 2;
    }
  }

  private generateCalendar(date: Moment, type: DateRange) {
    let calendarData;

    switch (type) {
      case DateRange.Month:
        calendarData = this.calendar.generateMonth(date, this.shifts);
        break;
      case DateRange.Week:
        calendarData = this.calendar.generateWeek(date, this.shifts, this.customRange);
        break;
      case DateRange.Day:
        calendarData = this.calendar.generateDay(date, this.shifts);
        break;

      default:
        break;
    }

    this.calendarData = calendarData;
  }

  private updateCalendar(date: Moment, type: DateRange) {
    this.updateCalendarHeader(date, type);
    this.generateCalendar(date, type);
  }

  private updateCalendarHeader(date: Moment, type: DateRange) {
    this.rangeTitle = this.calendar.getRangeFormatDate(date, type, this.customRange);
  }

  private updateDate(date: Moment, type: DateRange, increment: boolean) {
    return increment ? date.add(1, type) : date.add(-1, type);
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touch', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.filter.nativeElement || (this.datepicker && clickedComponent === this.datepicker.nativeElement)) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      if (!this.status.hideAutocomplete) {
        this.status.hideAutocomplete = true;
      }
      if (this.showCalendarDropdown) {
        this.showCalendarDropdown = false;
      }
    }
  }
}
