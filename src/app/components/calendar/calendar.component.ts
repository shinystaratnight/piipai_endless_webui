import { Component, Input, OnInit, HostListener, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';

import { Moment } from 'moment-timezone';

import { CalendarService, CalendarData } from './calendar.service';
import { DateRange, filterDateFormat, isManager } from '../../helpers';
import { FormatString } from '../../helpers/format';
import { CalendarDataService, CalendarType } from './calendar-data.service';
import { filters } from './calendar-filters.meta';
import { TimeService } from '../../shared/services';

import { DatepickerComponent } from '../../shared/components/datepicker/datepicker.component';
import { Role, UserService } from '../../services';

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
  public timesheetStatus = {
    0: { color: 'warning', key: 'Pending' },
    1: { color: 'info', key: 'Filled' },
    2: { color: 'success', key: 'Approved' },
  };
  public showClientFilter = true;
  public showCalendarDropdown: boolean;
  public clientContactCalendar: boolean;
  public calendarType: CalendarType;

  // @Input()
  public client: string;

  @Input()
  public role: Role;

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
  isManager = isManager;

  private modalRef: NgbModalRef;
  private lastData: any;

  constructor(
    private calendar: CalendarService,
    private data: CalendarDataService,
    private modalService: NgbModal,
    private router: Router,
    private time: TimeService,
    private userService: UserService,
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

    if (this.role && this.role.__str__.includes('client')) {
      this.calendarType = CalendarType.Client;
    }

    if (this.role && this.role.__str__.includes('candidate')) {
      this.calendarType = CalendarType.Candidate;
    }

    if (this.role && this.role.__str__.includes('manager')) {
      this.calendarType = CalendarType.Manager;
    }

    // if (this.client) {
    //   this.showClientFilter = false;
    // }

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

  public setAvailability(event: Event, day: any, available: boolean) {
    event.preventDefault();
    event.stopPropagation();

    const { availableId, date } = day;

    const body = {
      confirmed_available: available,
      target_date: date,
      candidate_contact: this.userService.user.data.contact.candidate_contact
    };

    if (availableId) {
      this.data.updateAvailable(availableId, body).subscribe(() => this.changeCalendar());
    } else {
      this.data.setAvailability(body).subscribe(() => this.changeCalendar());
    }
  }

  private changeCalendar(type?: DateRange) {
    const rangeType = type || this.currentRange.value;

    const range = this.customRange || this.calendar.getRangeDates(this.currentDate, rangeType);

    const shiftQuery = this.generateQuery(range.start, range.end, this.client, this.candidate);
    let availabilityQuery;
    let timesheetQuery;
    if (this.calendarType === CalendarType.Candidate) {
      availabilityQuery = this.generateCandidateQuery(range.start, range.end);
      timesheetQuery = this.generateCandidateTimesheetQuery(range.start, range.end);
    }

    this.getData(rangeType, shiftQuery, availabilityQuery, timesheetQuery);
  }

  private getShifts(query: any) {
    return this.data.getShiftsByQuery(query, this.calendarType);
  }

  private getCandidateAvailability(query: any) {
    return this.data.getCandidateAvailability(query);
  }

  private getCandidateTimesheets(query: any) {
    return this.data.getTimesheetInformation(query, this.calendarType);
  }


  private getData(range: DateRange, shiftQuery: any, availabilityQuery?: any, timesheetQuery?: any) {
    const requests = [this.getShifts(shiftQuery)];

    if (this.calendarType === CalendarType.Candidate) {
      requests.push(this.getCandidateAvailability(availabilityQuery));
      requests.push(this.getCandidateTimesheets(timesheetQuery));
    }

    combineLatest(requests).subscribe((data) => {
      const availability = data[1] ? data[1]['results'] : [];
      const timesheets = data[2] ? data[2]['results'] : [];

      this.prepareData(data[0], timesheets);

      if (availability.length) {
        this.shifts.push(...availability);
      }

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

    if (this.calendarType === CalendarType.Client) {
      filterList['role'] = this.role.id;
    }

    if (client) {
      filterList['client'] = client;
    }

    if (candidate) {
      filterList['candidate'] = candidate;
    }

    return filterList;
  }

  private generateCandidateQuery(from: Moment, to: Moment) {
    const filterList = {
      ['target_date_0']: from.format(filterDateFormat),
      ['target_date_1']: to.format(filterDateFormat),
      fields: ['id', 'target_date', 'confirmed_available'],
      limit: -1,
    };

    return filterList;
  }

  private generateCandidateTimesheetQuery(from: Moment, to: Moment) {
    const filterList = {
      ['shift_started_at_0']: from.format(filterDateFormat),
      ['shift_started_at_1']: to.format(filterDateFormat),
      fields: ['id', 'candidate_filled', 'supervisor_approved', 'shift'],
      limit: -1,
    };

    return filterList;
  }

  private prepareData(data, timesheetList?) {
    this.shifts = [];
    data = Array.isArray(data) ? data : data.results;

    this.lastData = data;
    this.timesheetCounter.forEach((el) => el.count = 0);

    if (data.length) {
      this.shifts = data
        .map((shift) => {
          const timesheets = timesheetList ? timesheetList.filter((timesheet) => shift.id === timesheet.shift.id) : [];

          return {
            shift,
            job_link: `/hr/jobs/${shift.date.job.id}/change`,
            date: shift.date.shift_date,
            time: shift.time,
            jobsite: shift.date.job.jobsite.name,
            position: shift.date.job.position.name,
            is_fulfilled: this.getFulfilledStatus(shift.is_fulfilled, shift.workers_details),
            candidates: shift.workers_details,
            timesheet: this.calendar.calculateShiftSize(shift.time),
            timesheets,
            timesheetStatus: this.getTimesheetsStatus(timesheets[0])
          };
        })
        .filter((shift) => this.status.data[shift.is_fulfilled]);

      this.shifts.forEach((shift) => {
        this.timesheetCounter.forEach((counter) => {
          counter.count += shift.candidates[this.shiftStatus[counter.type].key].length;
        });
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

  private getTimesheetsStatus(timesheet: any) {
    if (timesheet) {
      if (!timesheet.candidate_filled) {
        return 0;
      }

      if (timesheet.candidate_filled && !timesheet.supervisor_approved) {
        return 1;
      }

      if (timesheet.candidate_filled && timesheet.supervisor_approved) {
        return 2;
      }
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
      if (
        (this.filter && (clickedComponent === this.filter.nativeElement))
        || (this.datepicker && clickedComponent === this.datepicker.nativeElement)
      ) {
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
