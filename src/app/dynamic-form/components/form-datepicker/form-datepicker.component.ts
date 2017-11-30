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

  public viewMode: boolean;

  constructor(
    private fb: FormBuilder
  ) {
    super();
    this.$ = require('jquery');
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.mobileDevice = this.identifyDevice();
    this.createEvent();
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
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
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });
    }
  }

  public setInitValue() {
    if (this.config.value || this.group.get(this.key).value) {
      let data = this.config.value ? this.config.value :
        this.group.get(this.key).value;
      this.setDate(data, moment);
    } else if (this.config.default) {
      this.setDate(this.config.default, moment);
    }
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
        useClearButton: true,
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
      if (this.config.templateOptions.type === 'datetime') {
        this.$(this.t.nativeElement).datebox({
          mode: timeType,
          overrideTimeFormat: 12,
          overrideTimeOutput: '%I:%M %p',
          useClearButton: true,
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
      this.d.nativeElement.readOnly = false;
      this.t.nativeElement.readOnly = false;
    }
  }

  public updateDate(date) {
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
        if (!this.time) {
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
        date = moment(value, 'YYYY-MM-DD hh:mm A');
      } else {
        date = moment(value);
      }
      this.updateDate(date);
    }
  }
}
