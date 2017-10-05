import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import moment from 'moment';

export interface VacancyDate {
  shift_date: string;
  workers: number;
}

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

  public vacancyDate: VacancyDate;
  public vacancyDates: VacancyDate[];

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  public ngOnInit() {
    this.vacancyDates = [];
    this.calcMinDate(moment);
    this.addControl(this.config, this.fb);
    if (this.config && this.config.value) {
      this.vacancyDates = this.generateVacancyDates(this.config.value, moment);
      this.group.get(this.key).patchValue(this.config.value);
    }
  }

  public calcMinDate(time) {
    this.minDate = {
      year: time().year(),
      month: time().month() + 1,
      day: time().date()
    };
  }

  public generateVacancyDates(value: VacancyDate[], moment): VacancyDate[] {
    return value.map((el) => {
      let val: VacancyDate = {
        shift_date: '',
        workers: 0
      };
      if (el.shift_date) {
        val.shift_date = moment(el.shift_date).format(this.dateFormat);
      }
      if (el.workers) {
        val.workers = el.workers;
      }
      return val;
    });
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
