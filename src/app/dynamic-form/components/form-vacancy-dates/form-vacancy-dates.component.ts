import { Component, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import moment from 'moment-timezone';

@Component({
  selector: 'form-vacancy-dates',
  templateUrl: 'form-vacancy-dates.component.html',
  styleUrls: ['./form-vacancy-dates.component.scss']
})

export class FormVacancyDatesComponent extends BasicElementComponent implements OnInit {

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  public event: EventEmitter<any> = new EventEmitter();

  public displayMonths = 2;
  public navigation = 'arrows';
  public dateFormat = 'YYYY-MM-DD';
  public minDate: any;
  public markDisabled: Function;
  public vacancyDate: any;
  public vacancyDates: string[];
  public dates: any[] = [];

  @ViewChild('calendar') public calendar: ElementRef;

  constructor(
    private fb: FormBuilder
  ) {
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

        if (today.year() === date.year && today.month() + 1 === date.month && today.date() === date.day) { //tslint:disable-line
          return exist || today.isAfter(moment.tz([year, month - 1, day, hour, minute], 'Australia/Sydney'));
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

    this.dates.push(e);
    this.vacancyDates = this.vacancyDates || [];
    if (this.vacancyDates.indexOf(date) === -1) {
      this.vacancyDates.push(date);
    }

    this.group.get(this.key).patchValue(this.vacancyDates);
    this.event.emit({
      el: this.config,
      type: 'change'
    });

    setTimeout(() => {
      this.markSelectedDates(this.dates);
    }, 10);
  }

  public removeDate(date, time = moment) {
    const month = time(date).month() + 1;
    const day = time(date).date();

    const dateObj = this.dates.find((el) => el.month === month && el.day === day);
    const removeDate = dateObj && this.dates.splice(this.dates.indexOf(dateObj), 1);

    this.vacancyDates.splice(this.vacancyDates.indexOf(date), 1);
    this.vacancyDate = this.vacancyDates[0];

    setTimeout(() => {
      this.markSelectedDates(removeDate, true);
    }, 10);
  }

  public markSelectedDates(data = [], remove?) {
    const calendar = this.calendar.nativeElement;
    const monthes = {};
    data.forEach((el) => {
      if (!monthes[el.month]) {
        monthes[el.month] = {
          dates: [el.day + '']
        };
      } else {
        monthes[el.month].dates.push(el.day + '');
      }
    });

    Object.keys(monthes).forEach((month) => {
      const dates = calendar.querySelectorAll(`[ng-reflect-current-month="${month}"]`);
      const days = [].filter.call(dates, (day) => monthes[month].dates.indexOf(day.innerText) > -1);

      [].forEach.call(days, (day) => {
        if (remove) {
          day.classList.remove('bg-primary');
          day.classList.remove('text-white');
        } else {
          day.classList.add('bg-primary');
          day.classList.add('text-white');
        }
      });
    });
  }

  public eventHandler(e) {
    if (e.target.classList.contains('ngb-dp-navigation-chevron')) {
      this.markSelectedDates(this.dates);
    }
  }

}
