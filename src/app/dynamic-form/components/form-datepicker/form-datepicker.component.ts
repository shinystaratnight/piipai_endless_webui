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
  public displayValue: string;

  public dateFormat: string = 'DD/MM/YYYY';
  public datetimeFormat: string = 'DD/MM/YYYY hh:mm A';
  public timeFormat: string = 'hh:mm A';

  public viewMode: boolean;

  constructor(
    private fb: FormBuilder
  ) {
    super();
    this.$ = require('jquery');
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb, this.config.templateOptions.required);
    this.setInitValue(moment);
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.mobileDevice = this.identifyDevice();
    this.createEvent();
    this.group.get(this.key).valueChanges.subscribe((val) => {
      if (!val) {
        setTimeout(() => {
          this.event.emit({
            el: this.config,
            type: 'change'
          });
        }, 150);
      }
    });
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          if (this.group.get(this.key).value) {
            this.group.get(this.key).patchValue(undefined);
          }
          this.setInitValue(moment);
        } else {
          this.config.hide = hide;
        }
      });
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
          this.group.get(this.key).patchValue(undefined);
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue(moment);
      });
    }
  }

  public setInitValue(moment) {
    let type = this.config.templateOptions.type;
    if (this.config.value || this.group.get(this.key).value) {
      let data = this.config.value ? this.config.value : this.group.get(this.key).value;
      if (type === 'date' || type === 'datetime') {
        this.setDate(data, moment);
        this.displayValue = data ?
                            moment.tz(data, 'Australia/Sydney')
                                  .format(type === 'date' ? this.dateFormat : this.datetimeFormat) :
                            '-';
      } else if (type === 'time') {
        this.setTime(data, moment);
        this.displayValue = data ? moment(data, 'HH:mm:ss').format('hh:mm A') : '-';
      }
    } else if (this.config.default && this.config.default !== '-') {
      let data = this.config.default;
      if (type === 'date' || type === 'datetime') {
        this.setDate(data, moment);
        this.displayValue = data ?
                            moment.tz(data, 'Australia/Sydney')
                                  .format(type === 'date' ? this.dateFormat : this.datetimeFormat) :
                            '-';
      } else if (type === 'time') {
        this.setTime(data, moment);
        this.displayValue = data ? moment(data, 'HH:mm:ss').format(this.timeFormat) : '-';
      }
    }
  }

  public identifyDevice() {
    let deviceNamesReg = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return deviceNamesReg.test(navigator.userAgent.toLowerCase());
  }

  public ngAfterViewInit() {
    if (!this.init) {
      let dateType = this.mobileDevice ? 'flipbox' : 'calbox';
      let timeType = this.mobileDevice ? 'timeflipbox' : 'timebox';
      this.init = true;
      let type = this.config.templateOptions.type;
      if (type === 'date' || type === 'datetime') {
        this.$(this.d.nativeElement).datebox({
          mode: dateType,
          dateFormat: '%d/%m/%Y',
          overrideDateFormat: '%d/%m/%Y',
          useClearButton: false,
          useHeader: false,
          calHighToday: false,
          closeCallback: () => {
            let date = this.d.nativeElement.value;
            let time = this.t.nativeElement.value;
            if (date) {
              let fullDate = date + (time ? ` ${time}` : '');
              this.setDate(fullDate, moment, true);
            } else {
              this.group.get(this.key).patchValue(null);
            }
          }
        });
      }
      if (type === 'datetime') {
        this.$(this.t.nativeElement).datebox({
          mode: timeType,
          overrideTimeFormat: 12,
          overrideTimeOutput: '%I:%M %p',
          useClearButton: false,
          useHeader: false,
          calHighToday: false,
          closeCallback: () => {
            let date = this.d.nativeElement.value;
            let time = this.t.nativeElement.value;
            if (date) {
              let fullDate = date + (time ? ` ${time}` : '');
              this.setDate(fullDate, moment, true);
            } else {
              this.group.get(this.key).patchValue(null);
            }
          }
        });
      }
      if (type === 'time') {
        this.$(this.t.nativeElement).datebox({
          mode: timeType,
          overrideTimeFormat: 12,
          overrideTimeOutput: '%I:%M %p',
          useClearButton: false,
          useHeader: false,
          calHighToday: false,
          closeCallback: () => {
            let time = this.t.nativeElement.value;
            if (time) {
              this.setTime(time, moment, true);
            } else {
              this.group.get(this.key).patchValue(null);
            }
          }
        });
      }
      this.d.nativeElement.readOnly = false;
      this.t.nativeElement.readOnly = false;
    }
  }

  public updateDate(date) {
    if (this.config.templateOptions.type === 'date') {
      if (date) {
        if (!this.date) {
          this.date = date.format(this.dateFormat);
        }
        this.group.get(this.key).patchValue(date.format('YYYY-MM-DD'));
        this.event.emit({
          el: this.config,
          type: 'change'
        });
      }
    } else if (this.config.templateOptions.type === 'datetime') {
      if (date) {
        if (!this.date) {
          this.date = date.format(this.dateFormat);
        }
        if (!this.time) {
          this.time = date.format(this.timeFormat);
        }
        this.group.get(this.key).patchValue(date.format());
        this.event.emit({
          el: this.config,
          type: 'change'
        });
      }
    }
  }

  public updateTime(time) {
    if (time) {
      if (!this.time) {
        this.time = time.format(this.timeFormat);
      }
      this.group.get(this.key).patchValue(time.format('HH:mm:ss'));
      this.event.emit({
        el: this.config,
        type: 'change'
      });
    }
  }

  public setDate(value, moment, picker = false) {
    let date;
    if (value) {
      if (picker) {
        date = moment(value, this.datetimeFormat);
      } else {
        date = moment(value);
      }
      this.updateDate(date);
    }
  }

  public setTime(value, moment, picker = false) {
    let time;
    if (value) {
      if (picker) {
        time = moment(value, this.timeFormat);
      } else {
        time = moment(value, 'HH:mm:ss');
      }
      this.updateTime(time);
    }
  }
}
