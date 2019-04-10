import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
  ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subscription, Subject } from 'rxjs';
import * as moment from 'moment-timezone';

import { BasicElementComponent } from './../basic-element/basic-element.component';
import { FormatString } from '../../../helpers/format';
import { isMobile } from '../../helpers';

@Component({
  selector: 'app-form-datepicker',
  templateUrl: 'form-datepicker.component.html'
})
export class FormDatepickerComponent extends BasicElementComponent
  implements OnInit, AfterViewInit, OnDestroy {
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
  public mobileDevice: boolean;
  public displayValue: string;
  public formData: any;
  public opened: boolean;
  public update: Subject<any>;

  public dateFormat = 'DD/MM/YYYY';
  public datetimeFormat = 'DD/MM/YYYY hh:mm A';
  public timeFormat = 'hh:mm A';
  public timeZone: string;

  public viewMode: boolean;
  public editMode: boolean;

  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) {
    super();
    this.subscriptions = [];
    this.editMode = true;
    this.timeZone = 'Australia/Sydney';
  }

  public ngOnInit() {
    this.update = new Subject();
    this.mobileDevice = isMobile();

    if (this.config.customDatepicker) {
      this.dateFormat = this.config.customDatepicker.dateFormat;
    }

    this.addControl(this.config, this.fb, this.config.templateOptions.required);
    this.setInitValue(moment);
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.checkFormData();
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

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      const subscription = this.config.hidden.subscribe((hide) => {
        if (hide && !this.config.hide) {
          this.config.hide = hide;
          if (this.group.get(this.key).value) {
            this.group.get(this.key).patchValue(undefined);
          }
          this.setInitValue(moment);
        } else {
          this.config.hide = hide;
        }

        if (!(<any> this.cd).destroyed) {
          this.cd.detectChanges();
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      const subscription = this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
          this.editMode = false;
          this.date = '';
          this.time = '';

          this.group.get(this.key).patchValue(undefined);
        } else {
          this.viewMode = this.config.read_only || false;
          this.editMode = true;
        }
        this.setInitValue(moment);
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkFormData() {
    if (this.config.formData) {
      const subscription = this.config.formData.subscribe((data) => {
        if (
          data.key !== this.config.key &&
          this.config.default &&
          this.config.default.includes('{') &&
          !this.config.isPrefilled
        ) {
          this.formData = data.data;
          this.setInitValue(moment);
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public setInitValue(moment) { //tslint:disable-line
    const type = this.config.templateOptions.type;

    if (
      (this.config.value || this.group.get(this.key).value) &&
      (!this.config.shouldUpdate || this.config.isPrefilled)
    ) {
      const data = this.config.value
        ? this.config.value
        : this.group.get(this.key).value;
      if (type === 'date' || type === 'datetime') {
        this.setDate(data, moment);
        this.displayValue = data
          ? moment
              .tz(data, this.timeZone)
              .format(type === 'date' ? this.dateFormat : this.datetimeFormat)
          : '-';
      } else if (type === 'time') {
        this.setTime(data, moment);
        this.displayValue = data
          ? moment(data, 'HH:mm:ss').format('hh:mm A')
          : '-';
      }
    } else if (this.config.default && this.config.default !== '-') {
      let data;

      if (this.config.default.includes('{')) {
        const format = new FormatString();
        data = format.format(this.config.default, this.formData);
      } else {
        data = this.config.default;
      }

      if (type === 'date' || type === 'datetime') {
        this.setDate(data, moment);
        this.displayValue = data
          ? moment
              .tz(data, this.timeZone)
              .format(type === 'date' ? this.dateFormat : this.datetimeFormat)
          : '-';
      } else if (type === 'time') {
        if (!this.mobileDevice) {
          this.setTime(data, moment);
        } else {
          this.time = data;
        }
        this.displayValue = data
          ? moment(data, 'HH:mm:ss').format(this.timeFormat)
          : '-';
      }
    }
  }

  public setDatepickerDate() {
    if (this.init) {
      if (this.date) {
        (window as any).$(this.d.nativeElement).datebox('setTheDate', this.date);
      } else {
        (window as any).$(this.d.nativeElement).datebox('refresh');
      }
    }
  }

  public closeDatePicker(element) {
    if (element) {
      (window as any).$(element).datebox('close');
    }
  }

  public setTimepickerTime() {
    if (this.init) {
      if (this.time) {
        (window as any).$(this.t.nativeElement).datebox('setTheDate', this.time);
      } else {
        (window as any).$(this.t.nativeElement).datebox('refresh');
      }
    }
  }

  public ngAfterViewInit() {
    if (this.mobileDevice) {
      return;
    }

    if (!this.init) {
      const dateType = this.mobileDevice ? 'flipbox' : 'calbox';
      const timeType = this.mobileDevice ? 'timeflipbox' : 'timebox';
      this.init = true;
      const type = this.config.templateOptions.type;
      if (type === 'date' || type === 'datetime') {
        (window as any).$(this.d.nativeElement).datebox({
          mode: dateType,
          dateFormat: this.config.customDatepicker ? this.config.customDatepicker.datepickerFormat : '%d/%m/%Y',
          overrideDateFormat: this.config.customDatepicker ? this.config.customDatepicker.datepickerFormat : '%d/%m/%Y',
          useClearButton: true,
          useFocus: true,
          useHeader: false,
          calHighToday: true,
          themeDatePick: 'primary',
          calUsePickers: true,
          useCancelButton: true,
          calYearPickRelative: false,
          calYearPickMax: this.key.includes('birthday') ? 0 : 6,
          calYearPickMin: -100,
          maxDays: this.key.includes('birthday') && -1,
          bootstrapDropdownRight: dateType === 'calbox',
          beforeOpenCallback: () => {
            this.opened = this.d.nativeElement;
            this.updatePosition();
            setTimeout(() => {
              this.refreshDatebox(this.d.nativeElement);
              if (type === 'datetime') {
                this.closeDatePicker(this.t.nativeElement);
                this.opened = this.d.nativeElement;
              }

              if (this.d.nativeElement && this.key.includes('birthday')) {
                this.updateBirthdayYearPickMax();
              }
            }, 200);
          },
          closeCallback: () => {
            const date = this.d.nativeElement.value;
            const time = this.t.nativeElement.value;
            if (date) {
              const fullDate = date + (time ? ` ${time}` : '');
              this.setDate(fullDate, moment, true);
            } else {
              this.group.get(this.key).patchValue(null);
            }
          }
        });
      }
      if (type === 'datetime') {
        (window as any).$(this.t.nativeElement).datebox({
          mode: timeType,
          overrideTimeFormat: 12,
          overrideTimeOutput: '%I:%M %p',
          useClearButton: true,
          useCancelButton: true,
          useFocus: true,
          useHeader: false,
          calUsePickers: true,
          calHighToday: true,
          themeDatePick: 'primary',
          calYearPickRelative: false,
          calYearPickMax: this.key.includes('birthday') ? 0 : 6,
          calYearPickMin: -100,
          maxDays: this.key.includes('birthday') && -1,
          bootstrapDropdownRight: timeType === 'timebox',
          beforeOpenCallback: () => {
            this.opened = this.t.nativeElement;
            this.updatePosition();
            setTimeout(() => {
              this.refreshDatebox(this.t.nativeElement);
              this.closeDatePicker(this.d.nativeElement);
            }, 200);
          },
          closeCallback: () => {
            const date = this.d.nativeElement.value;
            const time = this.t.nativeElement.value;
            if (date) {
              const fullDate = date + (time ? ` ${time}` : '');
              this.setDate(fullDate, moment, true);
            } else {
              this.group.get(this.key).patchValue(null);
            }
          }
        });
      }
      if (type === 'time') {
        (window as any).$(this.t.nativeElement).datebox({
          mode: timeType,
          overrideTimeFormat: 12,
          overrideTimeOutput: '%I:%M %p',
          useClearButton: true,
          useFocus: true,
          useHeader: false,
          calHighToday: false,
          bootstrapDropdownRight: timeType === 'timebox',
          beforeOpenCallback: () => {
            this.opened = this.t.nativeElement;
            this.updatePosition();
            setTimeout(() => {
              this.refreshDatebox(this.t.nativeElement);
            }, 200);
          },
          closeCallback: () => {
            const time = this.t.nativeElement.value;
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

  public updateDate(date?, e?) {
    if (this.config.templateOptions.type === 'date') {
      if (date) {
        if (!this.date || this.config.shouldUpdate) {
          if (!this.mobileDevice) {
            this.date = date.format(this.dateFormat);
          } else {
            this.date = date.format('YYYY-MM-DD');
          }
          this.setDatepickerDate();
        }
        this.group.get(this.key).patchValue(date.format('YYYY-MM-DD'));
        this.emitChanges();
      }
    } else if (this.config.templateOptions.type === 'datetime') {
      if (date) {
        if (!this.date || this.config.shouldUpdate) {
          if (!this.mobileDevice) {
            this.date = date.format(this.dateFormat);
          } else {
            this.date = date.format('YYYY-MM-DD');
          }
          this.setDatepickerDate();
        }
        if (!this.time || this.config.shouldUpdate) {
          if (!this.mobileDevice) {
            this.time = date.format(this.timeFormat);
          } else {
            this.time = date.format('HH:mm');
          }
          this.setTimepickerTime();
        }
        this.group.get(this.key).patchValue(date.format());
        this.emitChanges();
      }
    }

    if (e) {
      setTimeout(() => {
        return e;
      }, 100);
    }
  }

  public updateBirthdayYearPickMax() {
    if (this.group.get(this.key).value && this.config.templateOptions.type === 'date') {
      const maxValue = moment().year() - moment(this.group.get(this.key).value, 'YYYY-MM-DD').year();

      this.setDatepickerProp('calYearPickMax', maxValue, this.d.nativeElement);
    }
  }

  public refreshDatebox(element: HTMLElement) {
    if (element) {
      (window as any).$(element).datebox('refresh');
    }
  }

  public updateTime(time) {
    if (time) {
      if (!this.time) {
        this.time = time.format(this.timeFormat);
      }
      this.group.get(this.key).patchValue(time.format('HH:mm:ss'));
      this.emitChanges();
    }
  }

  public setDate(value, moment, picker = false) { //tslint:disable-line
    let date;
    if (value) {
      if (picker) {
        date = moment(value, this.datetimeFormat);
      } else {
        date = moment(value);
      }
      this.updateDate(date);
    } else if (!this.config.hide && this.config.shouldUpdate) {
      this.date = '';
      this.group.get(this.key).patchValue('');
      this.setDatepickerDate();
    }
  }

  public setTime(value, moment, picker = false) { //tslint:disable-line
    let time;
    if (value) {
      if (picker) {
        time = moment(value, this.timeFormat);
      } else {
        time = moment(value, 'HH:mm:ss');
      }
      this.updateTime(time);
    } else if (!this.config.hide && this.config.shouldUpdate) {
      this.time = '';
      this.group.get(this.key).patchValue('');
      this.setTimepickerTime();
    }
  }

  public emitChanges() {
    setTimeout(() => {
      this.event.emit({
        el: this.config,
        type: 'change',
        value: this.group.get(this.key).value
      });
    }, 150);
  }

  public updatePosition() {
    this.update.next();
  }

  public setDatepickerProp(propName: string, value: any, target: HTMLElement) {
    (window as any).$(target).datebox({
      [propName]: value
    });
  }

  public changeDate(e) {
    this.setDate(e, moment);
  }

  public changeTime(e: string) {
    if (this.date) {
      const hour = parseInt(e.split(':')[0], 10);
      const minute = parseInt(e.split(':')[1], 10);
      const datetime = moment(this.date).hour(hour).minute(minute);

      this.group.get(this.key).patchValue(datetime.format());
    } else {
      this.setTime(e, moment);
    }
  }

  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.el.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside && this.opened) {
      (window as any).$(this.opened).datebox('close');
    }
  }
}
