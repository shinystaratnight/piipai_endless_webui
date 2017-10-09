import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';
import moment from 'moment-timezone';

@Component({
  selector: 'form-datepicker',
  templateUrl: 'form-datepicker.component.html'
})

export class FormDatepickerComponent
  extends BasicElementComponent
  implements OnInit, AfterViewInit {

  @ViewChild('d')
  public d;

  @ViewChild('t')
  public t;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public time: any;
  public date: any;
  public label: boolean;
  public init: boolean;
  public $: any;
  public mobileDevice: boolean;

  constructor(
    private fb: FormBuilder
  ) {
    super();
    this.$ = require('jquery');
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    if (this.config.value || this.group.get(this.key).value) {
      let data = this.config.value ? this.config.value :
        this.group.get(this.key).value;
      this.setDate(data, moment);
    }
    this.mobileDevice = this.identifyDevice();
  }

  public identifyDevice() {
    let deviceNamesReg = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return deviceNamesReg.test(navigator.userAgent.toLowerCase());
  }

  public ngAfterViewInit() {
    if (this.d) {
      this.addFlags(this.d, this.config);
    }
    if (!this.init) {
      let dateType = this.mobileDevice ? 'flipbox' : 'calbox';
      let timeType = this.mobileDevice ? 'timeflipbox' : 'timebox';
      this.init = true;
      this.$(this.d.nativeElement).datebox({
        mode: dateType,
        closeCallback: () => {
          let date = this.d.nativeElement.value;
          let time = this.t.nativeElement.value;
          if (date) {
            let fullDate = date + (time ? ` ${time}` : '');
            this.setDate(fullDate, moment, true);
          }
        }
      });
      if (this.config.templateOptions.type === 'datetime') {
        this.$(this.t.nativeElement).datebox({
          mode: timeType,
          overrideTimeFormat: 12,
          overrideTimeOutput: '%I:%M %p',
          closeCallback: () => {
            let date = this.d.nativeElement.value;
            let time = this.t.nativeElement.value;
            if (date && time) {
              let fullDate = `${date} ${time}`;
              this.setDate(fullDate, moment, true);
            }
          }
        });
      }
      this.d.nativeElement.readOnly = false;
      this.t.nativeElement.readOnly = false;
    }
  }

  public updateDate(date, picker) {
    if (this.config.templateOptions.type === 'date') {
      if (date) {
        if (!this.date) {
          this.date = date.format('YYYY-MM-DD');
        }
        this.group.get(this.key).patchValue(date.format('YYYY-MM-DD'));
      }
    } else if (this.config.templateOptions.type === 'datetime') {
      if (date) {
        if (!this.date) {
          this.date = date.format('YYYY-MM-DD');
        }
        if (!this.time && !picker) {
          this.time = date.format('hh:mm A');
        }
        this.group.get(this.key).patchValue(date.format());
      }
    }
  }

  public setDate(value, moment, picker = false) {
    let date;
    if (value) {
      if (picker) {
        let newValue = moment.tz(value, 'Australia/Sydney').format().split('+')[0];
        date = moment.tz(newValue + '+10:00', 'Australia/Sydney');
      } else {
        date = moment.tz(value, 'Australia/Sydney');
      }
      this.updateDate(date, picker);
    }
  }
}
