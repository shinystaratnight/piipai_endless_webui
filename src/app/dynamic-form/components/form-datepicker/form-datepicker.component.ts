import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';
import moment from 'moment';

@Component({
  selector: 'form-datepicker',
  templateUrl: 'form-datepicker.component.html'
})

export class FormDatepickerComponent
  extends BasicElementComponent
  implements OnInit, AfterViewInit {

  @ViewChild('d')
  public d;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public time: any;
  public date: any;

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    if (this.config.value) {
      this.setDate(this.config.value, moment);
    }
  }

  public ngAfterViewInit() {
    this.addFlags(this.d, this.config);
  }

  public datepicker() {
    return true;
  }

  public updateDate() {
    if (this.config.templateOptions.type === 'date') {
      if (this.date) {
        let {year = 0, month = 0, day = 0} = {...this.date};
        this.group.get(this.key).patchValue(new Date(Date.UTC(year, month - 1, day)));
      }
    } else if (this.config.templateOptions.type === 'datetime') {
      if (this.date && this.time) {
        let {year = 0, month = 0, day = 0} = {...this.date};
        let {hour = 0, minute = 0} = {...this.time};
        this.group.get(this.key).patchValue(new Date(Date.UTC(year, month - 1, day, hour, minute)));
      }
    }
  }

  public setDate(value, moment) {
    let date = moment.utc(value, 'YYYY-MM-DD hh:mm:ss');
    this.date = {
      year: date.year(),
      month: date.month() + 1,
      day: date.date()
    };
    this.time = {
      hour: date.hour(),
      minute: date.minute(),
      second: date.second()
    };
    this.updateDate();
  }
}
