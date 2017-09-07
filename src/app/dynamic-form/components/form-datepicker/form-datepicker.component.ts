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
  public label: boolean;

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    if (this.config.value || this.group.get(this.key).value) {
      let data = this.config.value ? this.config.value :
        this.group.get(this.key).value;
      this.setDate(data, moment);
    }
  }

  public ngAfterViewInit() {
    this.addFlags(this.d, this.config);
  }

  public datepicker() {
    return true;
  }

  public updateDate(time = moment) {
    if (this.config.templateOptions.type === 'date') {
      if (this.date) {
        let {year = 0, month = 0, day = 0} = {...this.date};
        if (time) {
          let value = time.utc([year, month - 1, day]).format('YYYY-MM-DD');
          this.group.get(this.key).patchValue(value);
        }
      }
    } else if (this.config.templateOptions.type === 'datetime') {
      if (this.date && this.time) {
        let {year = 0, month = 0, day = 0} = {...this.date};
        let {hour = 0, minute = 0} = {...this.time};
        if (time) {
          let value = time.utc([year, month - 1, day, hour, minute]).format('YYYY-MM-DD hh:mm');
          this.group.get(this.key).patchValue(value);
        }
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
