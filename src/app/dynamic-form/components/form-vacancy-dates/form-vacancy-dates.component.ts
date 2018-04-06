import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import moment from 'moment-timezone';

@Component({
  selector: 'form-vacancy-dates',
  templateUrl: 'form-vacancy-dates.component.html'
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
  }

  public markDisabledDates(dates: any[] = []) {
    this.markDisabled = (date, current) => {
      const exist = dates.find((item) => {
        const parsedDate = moment(item);

        const year = parsedDate.year();
        const month = parsedDate.month() + 1;
        const day = parsedDate.date();

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
    this.group.get(this.key).patchValue(time([e.year, e.month - 1, e.day]).format(this.dateFormat));
    this.event.emit({
      el: this.config,
      type: 'change'
    });
  }

}
