import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';

import { BasicElementComponent } from './../basic-element/basic-element.component';
import { getTimeInstance, getToday } from '@webui/utilities';

@Component({
  selector: 'app-form-vacancy-dates',
  templateUrl: 'form-vacancy-dates.component.html',
  styleUrls: ['./form-vacancy-dates.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormVacancyDatesComponent
  extends BasicElementComponent
  implements OnInit, OnDestroy
{
  @Input()
  public deleteDate: BehaviorSubject<string>;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  public event: EventEmitter<any> = new EventEmitter();

  public displayMonths = 3;
  public navigation = 'none';
  public dateFormat = 'YYYY-MM-DD';
  public minDate: any;
  public markDisabled: Function;
  public vacancyDates: string[];
  public dates: any = {};
  public todayElement: any;
  public timeInstance = getTimeInstance();
  public updating: boolean;

  @ViewChild('calendar')
  public calendar: ElementRef;

  private subscription: Subscription;

  constructor(private fb: FormBuilder, private ngbCalendar: NgbCalendar) {
    super();
  }

  public ngOnInit() {
    this.calcMinDate(this.timeInstance);
    this.addControl(this.config, this.fb);
    if (this.config && this.config.value) {
      this.group.get(this.key).patchValue(this.config.value);
    }

    if (this.config.value) {
      this.markDisabledDates(this.config.value);
    }

    if (this.config.removeDate) {
      this.subscription = this.config.removeDate.subscribe((date) => {
        if (date) {
          this.removeDate(date);
        }
      });
    }
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public markDisabledDates(dates: any[] = []) {
    this.markDisabled = (calendarDate) => {
      const exist = dates.find((shift) => {
        const shiftDate = this.timeInstance(shift);

        return (
          shiftDate.year() === calendarDate.year &&
          shiftDate.month() + 1 === calendarDate.month &&
          shiftDate.date() === calendarDate.day
        );
      });

      if (!exist) {
        return exist;
      }

      const existDate = this.timeInstance(exist);
      const today = getToday();

      if (
        today.year() === existDate.year() &&
        today.month() === existDate.month() &&
        today.date() === existDate.date()
      ) {
        return today.isAfter(existDate);
      }

      return exist;
    };
  }

  public calcMinDate(time) {
    this.minDate = {
      year: time().year(),
      month: time().month() + 1,
      day: time().date()
    };
  }

  public selectVacancyDate(e: NgbDate, time = this.timeInstance) {
    if (e && !this.updating) {
      this.updating = true;
      const { year, month, day } = e;
      const date = time([year, month - 1, day]).format(this.dateFormat);

      let dates = this.vacancyDates || [];

      if (dates.indexOf(date) === -1) {
        this.dates[date] = null;
        dates.push(date);

        setTimeout(() => {
          this.markSelectedDates(date);
        }, 150);
      } else {
        dates = [...dates.filter((el) => el !== date)];

        setTimeout(() => {
          this.markSelectedDates(date, true);
        });
      }

      this.vacancyDates = [...dates];
      this.group.get(this.key).patchValue(this.vacancyDates);
      this.event.emit({
        el: this.config,
        type: 'change'
      });
    }
  }

  public removeDate(date) {
    this.vacancyDates.splice(this.vacancyDates.indexOf(date), 1);

    setTimeout(() => {
      this.markSelectedDates(date, true);
    });
  }

  public markSelectedDates(date?, remove?) {
    const calendar = this.calendar.nativeElement;
    const selectedDate = calendar.querySelectorAll(`.bg-primary`);
    const currentDate = selectedDate[0];

    if (currentDate && date && !this.dates[date]) {
      this.dates[date] = currentDate.parentElement;
    }

    if (remove) {
      if (this.dates[date]) {
        this.dates[date].children[0].classList.remove('selected-date');
        this.dates[date].children[0].classList.add('removed-date');
      }

      delete this.dates[date];
    }

    Object.keys(this.dates).forEach((el) => {
      if (this.dates[el]) {
        const element = this.dates[el].children[0];

        if (element) {
          element.classList.add('selected-date');
          element.classList.remove('removed-date');
        }
      }
    });

    this.updating = false;
  }

  public isToday(month: number, day: number): boolean {
    const today = this.ngbCalendar.getToday();

    return today.month === month && today.day === day;
  }
}
