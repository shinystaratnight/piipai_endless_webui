import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  HostBinding,
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
defineLocale('en-gb', enGbLocale);

import { Subscription, Subject } from 'rxjs';

import { getTimePickerConfig } from './form-datepicker.config';
import { BasicElementComponent } from '../basic-element/basic-element.component';

import { FormatString, isMobile, getTranslationKey } from '@webui/utilities';
import { DateService } from '@webui/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import {
  API_DATE_FORMAT,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  FULL_TIME_FORMAT,
  TIME_FORMAT,
} from '@webui/time';
import { Moment } from '@webui/time';

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
export class FormDatepickerComponent
  extends BasicElementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
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
    date: DATE_FORMAT,
    datetime: DATE_TIME_FORMAT,
    time: TIME_FORMAT,
  };

  public viewMode: boolean;
  public editMode = true;

  public currentField: boolean;
  locale = 'en-gb';
  getTranslationKey = getTranslationKey;

  private subscriptions: Subscription[] = [];

  get formControl(): FormControl {
    return this.group.get(this.key) as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private dateService: DateService,
    private localeService: BsLocaleService
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
        });
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

    if (type === 'datetime' || type === 'time') {
      const config = getTimePickerConfig(this.config);

      Object.assign(config, {
        beforeOpenCallback: () => {
          this.setOpenDatepicker(this.t);
          this.updatePosition();
          this.refreshDatebox(this.t);
        },

        closeCallback: () => {
          // closeCallback: ({ date }) => {
          // const hours = date.getHours();
          // const minutes = date.getMinutes();

          // const dateInstance = this.dateService.parse(
          //   `${hours}:${minutes}`,
          //   { timezone: this.timezone, format: 'H:m' }
          // );

          // const time = dateInstance.format(TIME_FORMAT);
          this.updateForm(type, this.getValue(type));

          this.opened = null;
        },
      });

      this.getDatepicker(this.t).datebox(config);
    }

    this.t.nativeElement.readOnly = false;
  }

  public onDateChange() {
    const { type } = this.config.templateOptions;

    this.updateForm(type, this.getValue(type));
  }

  public updateFromMobile() {
    setTimeout(() => {
      const { type } = this.config.templateOptions;
      this.updateForm(type, this.getValue(type));
    }, 100);
  }

  public updatePosition() {
    this.update.next();
  }

  public removeDate(date: string): void {
    if (this.config.many) {
      const prevValue = this.formControl.value;
      const newValue = prevValue.filter((item) => item !== date);

      this.formControl.patchValue(newValue.length ? newValue : null);
    }
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
        const dateInstance = this.dateService.parse(value, {
          timezone: time_zone,
          format: parseFormat,
        });

        this.config.value = dateInstance.format(API_DATE_FORMAT);
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

  private updateModel(value: Moment) {
    if (this.mobileDevice) {
      this.model.date = value.format(API_DATE_FORMAT);
      this.model.time = value.format(TIME_FORMAT);
    } else {
      this.model.date = value.format(this.formats.date);
      this.model.time = value.format(this.formats.time);
    }
  }

  private parseValue(type: DateType, value: string): Moment {
    switch (type) {
      case DateType.Date: {
        return this.dateService.parse(value, {
          timezone: this.timezone,
          format: API_DATE_FORMAT,
        });
      }

      case DateType.Datetime: {
        return this.dateService.parse(value, { timezone: this.timezone });
      }

      case DateType.Time: {
        return this.dateService.parse(value, {
          timezone: this.timezone,
          format: FULL_TIME_FORMAT,
        });
      }
    }
  }

  private setDisplayValue(type: DateType, value?: Moment) {
    if (!value) {
      this.displayValue = null;
      return;
    }

    switch (type) {
      case DateType.Date: {
        this.displayValue = value.format(this.formats.date);
        break;
      }

      case DateType.Datetime: {
        this.displayValue = value.format(this.formats.datetime);
        break;
      }

      case DateType.Time: {
        this.displayValue = value.format(this.formats.time);
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

    let value = updateFromForm
      ? formValue || initValue
      : initValue || formValue;

    if ((!value && defaultValue && defaultValue !== '-') || shouldUpdate) {
      value = this.config.default.includes('{')
        ? FormatString.format(defaultValue, this.formData)
        : defaultValue;
    }

    if (value === this.group.get(this.key).value && !shouldUpdate) {
      return;
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

  private updateForm(type: DateType, value?: Moment): void {
    let data: string | null;

    switch (type) {
      case DateType.Date: {
        data = value ? value.format(API_DATE_FORMAT) : null;
        break;
      }

      case DateType.Datetime: {
        data = value ? value.utc().format() : null;
        break;
      }

      case DateType.Time: {
        data = value ? value.format(FULL_TIME_FORMAT) : null;
        break;
      }
    }

    if (this.config.many) {
      const prevValue = this.formControl.value || [];

      this.d.nativeElement.value = '';
      this.t.nativeElement.value = '';
      this.model.date = '';
      this.model.time = '';

      this.formControl.patchValue([...prevValue, data]);
    } else {
      this.group.get(this.key).patchValue(data);
    }

    this.emitChanges();
  }

  private getValue(type: DateType): Moment | null {
    if (this.mobileDevice) {
      const { date, time } = this.model;

      return this.parseValues(
        type,
        { value: date, format: API_DATE_FORMAT },
        { value: time, format: this.formats.time }
      );
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
  ): Moment {
    let result;

    switch (type) {
      case DateType.Date: {
        result = date.value
          ? this.dateService.parse(date.value, {
              timezone: this.timezone,
              format: date.format,
            })
          : null;
        break;
      }

      case DateType.Datetime: {
        if (!date.value) {
          result = null;
        } else if (!time.value) {
          result = this.dateService.parse(date.value, {
            timezone: this.timezone,
            format: date.format,
          });
        } else {
          result = this.dateService.parse(`${date.value} ${time.value}`, {
            timezone: this.timezone,
            format: `${date.format} ${time.format}`,
          });
        }
        break;
      }

      case DateType.Time: {
        result = time.value
          ? this.dateService.parse(time.value, {
              timezone: this.timezone,
              format: time.format,
            })
          : null;
        break;
      }
    }

    return result;
  }

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
}
