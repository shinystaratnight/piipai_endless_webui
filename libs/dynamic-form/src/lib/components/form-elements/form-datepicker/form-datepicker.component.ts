import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
defineLocale('en-gb', enGbLocale);

import { Subscription, Subject } from 'rxjs';

import { getDatePickerConfig, getTimePickerConfig } from './form-datepicker.config';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import { FormatString, isMobile, getPropValue, getTranslationKey } from '@webui/utilities';
import { DateService, DateInstance, Format } from '@webui/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

enum DateType {
  Date = 'date',
  Datetime = 'datetime',
  Time = 'time',
}

@Component({
  selector: 'app-form-datepicker',
  templateUrl: './form-datepicker.component.html',
  styleUrls: ['./form-datepicker.component.scss'],
})
export class FormDatepickerComponent extends BasicElementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('d') public d: ElementRef;
  @ViewChild('t') public t: ElementRef;

  @HostBinding('class.mobile-device') mobile = isMobile();

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  public model = {
    date: null,
    time: '',
  };

  public label: boolean;
  public init: boolean;
  public mobileDevice = isMobile();
  public displayValue: string;
  public formData: any;
  public placement: any;
  public maxDate: Date;

  public opened: ElementRef;
  public update: Subject<any> = new Subject();

  public timezone: string;
  public formats = {
    date: Format.Date,
    datetime: Format.DateTime,
    time: Format.Time,
  };

  public viewMode: boolean;
  public editMode = true;

  public currentField: boolean;
  locale = 'en-gb';
  getTranslationKey = getTranslationKey;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private dateService: DateService,
    private el: ElementRef,
    private localeService: BsLocaleService,
  ) {
    super();
  }

  public ngOnInit() {
    this.timezone = this.config.time_zone;

    this.checkOnCustomDatepicker(this.config);
    this.addControl(this.config, this.fb, this.config.templateOptions.required);

    this.setInitValue();

    this.checkModeProperty();
    this.checkHiddenProperty();
    this.checkFormData();

    this.createEvent();

    this.subscriptions.push(this.subscribeOnChanges());

    const { type } = this.config.templateOptions;
    if (type === 'date' || type === 'datetime') {
      const isBirthday = this.key.includes('birthday');

      if (isBirthday) {
        setTimeout(() => {
          this.maxDate = new Date();
        })
      }
    }

    this.localeService.use(this.locale);
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public ngAfterViewInit() {
    if (this.mobileDevice || this.init) {
      return;
    }

    this.init = true;
    const { type } = this.config.templateOptions;

    // if (type === 'date' || type === 'datetime') {
    //   const isBirthday = this.key.includes('birthday');

    //   if (isBirthday) {
    //     setTimeout(() => {
    //       this.maxDate = new Date();
    //     })
    //   }
      // const config = getDatePickerConfig(this.config, isBirthday);

      // if (isBirthday) {
      //   this.updateBirthdayYearPickMax();
      // }

      // Object.assign(config, {
      //   beforeOpenCallback: () => {
      //     this.setOpenDatepicker(this.d);
      //     this.updatePosition();
      //     this.refreshDatebox(this.d);

      //     if (type === DateType.Datetime) {
      //       this.closeDatebox(this.t);
      //     }

      //     if (isBirthday) {
      //       this.updateBirthdayYearPickMax();
      //     }
      //   },

      //   closeCallback: () => {
      //     if (this.validateTimesheetTime(this.getValue(type))) {
      //       this.updateForm(type, this.getValue(type));
      //     } else {
      //       this.setDatepickerValue(this.d, this.model.date);
      //     }

      //     this.opened = null;
      //   },
      // });

      // this.getDatepicker(this.d).datebox(config);
    // }

    if (type === 'datetime' || type === 'time') {
      const config = getTimePickerConfig(this.config);

      Object.assign(config, {
        beforeOpenCallback: () => {
          this.setOpenDatepicker(this.t);
          this.updatePosition();
          this.refreshDatebox(this.t);
        },

        closeCallback: ({ date }) => {
          const hours = date.getHours();
          const minutes = date.getMinutes();

          const dateInstance = this.dateService.parse(`${hours}:${minutes}`, this.timezone, 'H:m');

          const newDateInstance = this.parseValues(
            type,
            { value: this.model.date, format: this.formats.date },
            { value: `${hours}:${minutes}`, format: 'H:m' }
          );

          // if (this.validateTimesheetTime(newDateInstance)) {
            const time = this.dateService.getTime(dateInstance);

            // this.setDatepickerValue(this.t, time);
            this.updateForm(type, this.getValue(type));
          // } else {
          //   this.setDatepickerValue(this.t, this.model.time);
          // }

          this.opened = null;
        },
      });

      this.getDatepicker(this.t).datebox(config);
    }

    // this.d.nativeElement.readOnly = false;
    this.t.nativeElement.readOnly = false;
  }

  public onDateChange() {
    const { type } = this.config.templateOptions;
    // if (this.validateTimesheetTime(this.getValue(type))) {
      this.updateForm(type, this.getValue(type));
    // } else {
    //   this.setDatepickerValue(this.d, this.model.date);
    // }
  }

  public updateFromMobile(data) {
    setTimeout(() => {
      const { type } = this.config.templateOptions;
      this.updateForm(type, this.getValue(type));
    }, 100);
  }

  public updatePosition() {
    this.update.next();
  }

  private setOpenDatepicker(el: ElementRef) {
    setTimeout(() => {
      this.opened = el.nativeElement;
    }, 100);
  }

  private checkOnCustomDatepicker(config) {
    const { value, customDatepicker, time_zone } = config;

    if (customDatepicker) {
      const { dateFormat, parseFormat } = customDatepicker;
      this.formats.date = dateFormat;

      if (value) {
        const dateInstance = this.dateService.parse(value, time_zone, parseFormat);

        this.config.value = this.dateService.format(dateInstance, 'YYYY-MM-DD');
      }
    }
  }

  private subscribeOnChanges(): Subscription {
    return this.group.get(this.key).valueChanges.subscribe((val) => {
      if (!val) {
        setTimeout(() => {
          this.event.emit({
            el: this.config,
            type: 'change',
          });
        }, 150);
      }
    });
  }

  private checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      const subscription = this.config.hidden.subscribe((hide) => {
        if (hide && !this.config.hide) {
          this.config.hide = hide;
          if (this.group.get(this.key).value) {
            this.group.get(this.key).patchValue(undefined);
          }
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }

        if (!(<any>this.cd).destroyed) {
          this.cd.detectChanges();
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  private checkModeProperty() {
    if (this.config && this.config.mode) {
      const subscription = this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
          this.editMode = false;
          this.model = { date: '', time: '' };

          this.group.get(this.key).patchValue(undefined);
        } else {
          this.viewMode = this.config.read_only || false;
          this.editMode = true;
        }
        this.setInitValue();
      });

      this.subscriptions.push(subscription);
    }
  }

  private checkFormData() {
    if (this.config.formData) {
      const subscription = this.config.formData.subscribe((data) => {
        if (
          data.key !== this.config.key &&
          this.config.default &&
          this.config.default.includes('{') &&
          !this.config.isPrefilled
        ) {
          this.formData = data.data;
          this.setInitValue();
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  private updateModel(value: DateInstance) {
    if (this.mobileDevice) {
      this.model.date = this.dateService.format(value, 'YYYY-MM-DD');
      this.model.time = this.dateService.format(value, 'HH:mm');
    } else {
      this.model.date = this.dateService.format(value, this.formats.date);
      this.model.time = this.dateService.format(value, this.formats.time);
    }
  }

  private parseValue(type: DateType, value: string): DateInstance {
    switch (type) {
      case DateType.Date: {
        return this.dateService.parse(value, this.timezone, 'YYYY-MM-DD');
      }

      case DateType.Datetime: {
        return this.dateService.parse(value, this.timezone);
      }

      case DateType.Time: {
        return this.dateService.parse(value, this.timezone, 'HH:mm:ss');
      }
    }
  }

  private setDisplayValue(type: DateType, value?: DateInstance) {
    if (!value) {
      this.displayValue = null;
      return;
    }

    switch (type) {
      case DateType.Date: {
        this.displayValue = this.dateService.format(value, this.formats.date);
        break;
      }

      case DateType.Datetime: {
        this.displayValue = this.dateService.format(value, this.formats.datetime);
        break;
      }

      case DateType.Time: {
        this.displayValue = this.dateService.format(value, this.formats.time);
        break;
      }
    }
  }

  private clearForm() {
    this.model.date = null;
    this.model.time = '';
    this.group.get(this.key).patchValue(null);
  }

  private setInitValue() {
    const { shouldUpdate, updateFromForm } = this.config;
    const { type } = this.config.templateOptions;
    const initValue = this.config.value;
    const formValue = this.group.get(this.key).value;
    const defaultValue = this.config.default;

    let value = updateFromForm ? formValue || initValue : initValue || formValue;

    if ((!value && defaultValue && defaultValue !== '-') || shouldUpdate) {
      value = this.config.default.includes('{') ? FormatString.format(defaultValue, this.formData) : defaultValue;
    }

    if (value) {
      const dateInstance = this.parseValue(type, value);
      this.updateModel(dateInstance);
      this.setDisplayValue(type, dateInstance);
      this.updateForm(type, dateInstance);
    } else if (shouldUpdate) {
      this.clearForm();
      this.setDisplayValue(type, null);
    }
  }

  private updateForm(type: DateType, value?: DateInstance): void {
    let data: string | null;

    switch (type) {
      case DateType.Date: {
        data = value ? this.dateService.format(value, 'YYYY-MM-DD') : null;
        break;
      }

      case DateType.Datetime: {
        data = value ? this.dateService.getUtc(value) : null;
        break;
      }

      case DateType.Time: {
        data = value ? this.dateService.format(value, 'HH:mm:ss') : null;
        break;
      }
    }

    this.group.get(this.key).patchValue(data);
    this.emitChanges();
  }

  private getValue(type: DateType): DateInstance | null {
    if (this.mobileDevice) {
      const { date, time } = this.model;

      return this.parseValues(type, { value: date, format: 'YYYY-MM-DD' }, { value: time, format: 'HH:mm' });
    }

    const date = this.d.nativeElement.value;
    const time = this.t.nativeElement.value;

    return this.parseValues(
      type,
      { value: date, format: this.formats.date },
      { value: time, format: this.formats.time }
    );
  }

  private parseValues(
    type: DateType,
    date: { value: string; format: string },
    time: { value: string; format: string }
  ): DateInstance {
    let result;

    switch (type) {
      case DateType.Date: {
        result = date.value ? this.dateService.parse(date.value, this.timezone, date.format) : null;
        break;
      }

      case DateType.Datetime: {
        if (!date.value) {
          result = null;
        } else if (!time.value) {
          result = this.dateService.parse(date.value, this.timezone, date.format);
        } else {
          result = this.dateService.parse(
            `${date.value} ${time.value}`,
            this.timezone,
            `${date.format} ${time.format}`
          );
        }
        break;
      }

      case DateType.Time: {
        result = time.value ? this.dateService.parse(time.value, this.timezone, time.format) : null;
        break;
      }
    }

    return result;
  }

  // private updateBirthdayYearPickMax() {
  //   const value = this.group.get(this.key).value;
  //   const { type } = this.config.templateOptions;

  //   if (value && type === 'date') {
  //     const now = this.dateService.instance();
  //     const dateInstance = this.dateService.parse(value, this.timezone, 'YYYY-MM-DD');

  //     const maxValue = now.year() - dateInstance.year();

  //     this.setDatepickerProp('calYearPickMax', maxValue, this.d);
  //   }
  // }

  private emitChanges() {
    this.event.emit({
      el: this.config,
      type: 'change',
      value: this.group.get(this.key).value,
    });
  }

  // Datepicker methods

  private getDatepicker(elementRef: ElementRef) {
    return (window as any).$(elementRef.nativeElement);
  }

  private refreshDatebox(element: ElementRef) {
    this.getDatepicker(element).datebox('refresh');
  }

  // private setDatepickerValue(element: ElementRef, value?: string): void {
  //   if (!this.init) {
  //     return;
  //   }

  //   console.log(value);

  //   const dp = this.getDatepicker(element);
  //   value ? dp.datebox('setTheDate', value) : dp.datebox('refresh');
  // }

  // private setDatepickerProp(propName: string, value: any, element: ElementRef) {
  //   const dp = this.getDatepicker(element);

  //   dp.datebox({ [propName]: value });
  // }

  // private validateTimesheetTime(date): boolean {
  //   if (!date) {
  //     return;
  //   }

  //   const dateUtc = date.utc();

  //   enum TimesheetTime {
  //     Start = 'shift_started_at',
  //     End = 'shift_ended_at',
  //     BreakStart = 'break_started_at',
  //     BreakEnd = 'break_ended_at',
  //   }

  //   const timesheetKeys = [TimesheetTime.Start, TimesheetTime.BreakStart, TimesheetTime.BreakEnd, TimesheetTime.End];

  //   if (!timesheetKeys.includes(this.config.key)) {
  //     return true;
  //   }

  //   const data = this.config.formData.value.data;

  //   const times = {};
  //   timesheetKeys.forEach((key) => {
  //     times[key] = getPropValue(data, key) && this.parseValue(DateType.Datetime, getPropValue(data, key));
  //   });

  //   let valid = true;

  //   switch (this.config.key) {
  //     case TimesheetTime.Start:
  //       if (times[TimesheetTime.BreakStart]) {
  //         valid = dateUtc.isBefore(times[TimesheetTime.BreakStart]);
  //       }

  //       if (valid && times[TimesheetTime.BreakEnd]) {
  //         valid = dateUtc.isBefore(times[TimesheetTime.BreakEnd]);
  //       }

  //       if (valid && times[TimesheetTime.End]) {
  //         valid = dateUtc.isBefore(times[TimesheetTime.End]);
  //       }

  //       break;

  //     case TimesheetTime.BreakStart: {
  //       if (times[TimesheetTime.Start]) {
  //         valid = dateUtc.isAfter(times[TimesheetTime.Start]);
  //       }

  //       if (valid && times[TimesheetTime.BreakEnd]) {
  //         valid = dateUtc.isBefore(times[TimesheetTime.BreakEnd]);
  //       }

  //       if (valid && times[TimesheetTime.End]) {
  //         valid = dateUtc.isBefore(times[TimesheetTime.End]);
  //       }
  //       break;
  //     }

  //     case TimesheetTime.BreakEnd: {
  //       if (times[TimesheetTime.Start]) {
  //         valid = dateUtc.isAfter(times[TimesheetTime.Start]);
  //       }

  //       if (valid && times[TimesheetTime.BreakStart]) {
  //         valid = dateUtc.isAfter(times[TimesheetTime.BreakStart]);
  //       }

  //       if (valid && times[TimesheetTime.End]) {
  //         valid = dateUtc.isBefore(times[TimesheetTime.End]);
  //       }
  //       break;
  //     }

  //     case TimesheetTime.End: {
  //       if (times[TimesheetTime.Start]) {
  //         valid = dateUtc.isAfter(times[TimesheetTime.Start]);
  //       }

  //       if (valid && times[TimesheetTime.BreakStart]) {
  //         valid = dateUtc.isAfter(times[TimesheetTime.BreakStart]);
  //       }

  //       if (valid && times[TimesheetTime.BreakEnd]) {
  //         valid = dateUtc.isAfter(times[TimesheetTime.BreakEnd]);
  //       }
  //       break;
  //     }

  //     default:
  //       break;
  //   }

  //   return valid;
  // }

  // @HostListener('document:touchstart', ['$event'])
  // @HostListener('document:click', ['$event'])
  // public handleClick(event) {
    // let clickedComponent = event.target;
    // let inside = false;
    // do {
    //   if (clickedComponent === this.el.nativeElement) {
    //     inside = true;
    //   }
    //   clickedComponent = clickedComponent.parentNode;
    // } while (clickedComponent);
    // if (!inside && this.opened) {
    //   (window as any).$(this.opened).datebox('close');
    // }
  // }
}
