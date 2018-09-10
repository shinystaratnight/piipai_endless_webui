import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import moment from 'moment-timezone';

@Component({
  selector: 'form-vacancy-dates',
  templateUrl: 'form-vacancy-dates.component.html',
  styleUrls: ['./form-vacancy-dates.component.scss']
})
export class FormVacancyDatesComponent extends BasicElementComponent
  implements OnInit, OnDestroy {
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
  public vacancyDate: any;
  public vacancyDates: string[];
  public dates: any = {};

  @ViewChild('calendar')
  public calendar: ElementRef;

  private subscription: Subscription;

  constructor(private fb: FormBuilder) {
    super();
  }

  public ngOnInit() {
    this.calcMinDate(moment);
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
    const today = moment().tz('Australia/Sydney');

    this.markDisabled = (date, current) => {
      const exist = dates.find((item) => {
        const parsedDate = moment(item);

        const year = parsedDate.year();
        const month = parsedDate.month() + 1;
        const day = parsedDate.date();
        const hour = parsedDate.hour();
        const minute = parsedDate.minute();

        if (
          today.year() === date.year &&
          today.month() + 1 === date.month &&
          today.date() === date.day
        ) {
          return (
            exist ||
            today.isAfter(
              moment.tz(
                [year, month - 1, day, hour, minute],
                'Australia/Sydney'
              )
            )
          );
        }

        return year === date.year && month === date.month && day === date.day;
      });
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

  public selectVacancyDate(e, time = moment) {
    const date = time([e.year, e.month - 1, e.day]).format(this.dateFormat);

    this.vacancyDates = this.vacancyDates || [];
    if (this.vacancyDates.indexOf(date) === -1) {
      this.dates[date] = null;

      this.vacancyDates.push(date);

      setTimeout(() => {
        this.markSelectedDates(date);
      }, 50);
    } else {
      this.vacancyDates.splice(this.vacancyDates.indexOf(date), 1);

      setTimeout(() => {
        this.markSelectedDates(date, true);
      }, 50);
    }

    this.group.get(this.key).patchValue(this.vacancyDates);
    this.event.emit({
      el: this.config,
      type: 'change'
    });
  }

  public removeDate(date, time = moment) {
    this.vacancyDates.splice(this.vacancyDates.indexOf(date), 1);

    setTimeout(() => {
      this.markSelectedDates(date, true);
    }, 50);
  }

  public markSelectedDates(date?, remove?) {
    const calendar = this.calendar.nativeElement;
    const selectedDate = calendar.querySelectorAll(
      `.bg-primary:not(.not-current)`
    );
    const currentDate = selectedDate[0];

    if (currentDate && date && !this.dates[date]) {
      this.dates[date] = currentDate.parentElement;
    }

    this.vacancyDate = {};

    setTimeout(() => {
      if (remove) {
        if (this.dates[date]) {
          this.dates[date].children[0].classList.remove('bg-primary');
          this.dates[date].children[0].classList.remove('text-white');
          this.dates[date].children[0].classList.remove('not-current');
        }

        delete this.dates[date];
      }
      Object.keys(this.dates).forEach((el) => {
        if (this.dates[el]) {
          const element = this.dates[el].children[0];

          if (element) {
            element.classList.add('bg-primary');
            element.classList.add('text-white');
            element.classList.add('not-current');
          }
        }
      });
    }, 50);
  }
}
