import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import moment from 'moment';

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

  public displayMonths = 2;
  public navigation = 'select';
  public dateFormat = 'YYYY-MM-DD';
  public minDate: any;

  public vacancyDate: any;
  public vacancyDates: any[];

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  public ngOnInit() {
    this.vacancyDates = [];
    this.calcMinDate(moment);
    this.addControl(this.config, this.fb);
  }

  public calcMinDate(time) {
    this.minDate = {
      year: time().year(),
      month: time().month() + 1,
      day: time().date()
    };
  }

  public selectVacancyDate(e, time = moment) {
    let vacancyDate = {
      shift_date: time().date(e.day).month(e.month - 1).year(e.year).format(this.dateFormat),
      workers: 1
    };
    if (this.checkIfExistVacancyDate(this.vacancyDates, vacancyDate)) {
      return;
    }
    this.vacancyDates.push(vacancyDate);
    this.vacancyDates.sort((p, n) => p.shift_date > n.shift_date ? 1 : -1);
    this.updateResults(this.vacancyDates);
  }

  public checkIfExistVacancyDate(vacancyDates, vacancyDate) {
    let element = vacancyDates.filter((el) => el.shift_date === vacancyDate.shift_date);
    return !!element.length;
  }

  public removeVacancyDate(vacancyDate) {
    let index = this.vacancyDates.indexOf(vacancyDate);
    this.vacancyDates.splice(index, 1);
    this.updateResults(this.vacancyDates);
  }

  public updateResults(value) {
    this.group.get(this.key).patchValue(value);
  }

}
