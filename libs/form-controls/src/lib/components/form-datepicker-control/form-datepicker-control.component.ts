import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Icon, IconSize } from '@webui/icon';
import { DatepickerType } from '../../enums/datepicker.enum';
import { DateService } from '@webui/core';
import { DateFormat } from '@webui/data';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { Dropdown } from '../../helpers';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'webui-form-datepicker-control',
  templateUrl: './form-datepicker-control.component.html',
  styleUrls: ['./form-datepicker-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDatepickerControlComponent),
      multi: true
    }
  ]
})
export class FormDatepickerControlComponent
  implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy
{
  @Input() label?: string;
  @Input() type?: DatepickerType;
  @Input() initialValue?: string;
  @Input() timezone?: string;

  @Input() timerFrom?: string;
  @Input() timerTo?: string;

  @ViewChild(CdkOverlayOrigin) overlayOrigin?: CdkOverlayOrigin;
  @ViewChild('content') content?: TemplateRef<any>;

  public Icon = Icon;
  public IconSize = IconSize;
  public value?: string;

  public dateControl = new FormControl('');
  public timeControl = new FormControl('');
  public durationControl = new FormControl('00h 00min');
  public hoursControl = new FormControl('00');
  public minutesControl = new FormControl('00');

  private onChange!: (value: string | undefined) => void;
  private onTouched!: () => void;

  private timerDropdown!: Dropdown;
  private destroy$: Subject<void> = new Subject<void>();

  public get isTimer(): boolean {
    return this.type === DatepickerType.Timer;
  }

  public get isDate(): boolean {
    return this.type === DatepickerType.Date;
  }

  public get isTime(): boolean {
    return this.type === DatepickerType.Time;
  }

  public get isDateTime(): boolean {
    return this.type === DatepickerType.DateTime;
  }

  public get hasIcon(): boolean {
    return this.platform.FIREFOX;
  }

  constructor(
    private dateService: DateService,
    private platform: Platform,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.parseInitialValue();
    this.parseTimerInitialValue();
    this.subscribeOnChanges();
    this.subscribeOnDurationChange();
  }

  public ngAfterViewInit(): void {
    if (this.overlayOrigin && this.content) {
      this.timerDropdown = new Dropdown(this.overlayOrigin, this.content);
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public showDurationDropdown(): void {
    this.timerDropdown.openDropdown(this.overlay, this.viewContainerRef, {});
  }

  public plus(control: FormControl): void {
    control.patchValue(parseInt(control.value, 10) + 1);

    this.updateDuration();
  }

  public minus(control: FormControl): void {
    control.patchValue(parseInt(control.value, 10) - 1);

    this.updateDuration();
  }

  private updateDuration(): void {
    const hours = this.hoursControl.value;
    const minutes = this.minutesControl.value;
    const duration = `${hours || '00'}h ${minutes || '00'}min`;

    this.durationControl.patchValue(duration);
  }

  private parseInitialValue(): void {
    if (!this.initialValue) {
      return;
    }

    const date = this.dateService.parse(this.initialValue, this.timezone);

    this.dateControl.patchValue(date.format('YYYY-MM-DD'), { emitEvent: false });
    this.timeControl.patchValue(date.format(DateFormat.Time), { emitEvent: false });
  }

  private parseTimerInitialValue(): void {
    if (!this.timerFrom || !this.timerTo) {
      return;
    }

    const from = this.dateService.parse(this.timerFrom, this.timezone);
    const to = this.dateService.parse(this.timerTo, this.timezone);
    const hours = to.diff(from, 'hours');
    const minutes = to.diff(from, 'minutes');

    this.durationControl.patchValue(`${hours}h ${minutes}min`, { emitEvent: false });
  }

  private subscribeOnChanges(): void {
    merge(
      this.dateControl.valueChanges,
      this.timeControl.valueChanges,
      this.durationControl.valueChanges
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.onChanges());
  }

  private onChanges(): void {
    const date = this.dateControl.value;
    const time = this.timeControl.value;

    if (this.isDate) {
      this.onChange(date);
    } else if (this.isTime) {
      this.onChange(time);
    } else if (this.isDateTime) {
      const datetime =
        date && time ? this.dateService.parse(`${date}T${time}`, this.timezone) : undefined;

      this.onChange(datetime ? datetime.utc().format() : undefined);
    } else if (this.isTimer) {
      const hours = this.hoursControl.value;
      const minutes = this.minutesControl.value;

      if (!hours && !minutes) {
        this.onChange('');
        return;
      }

      this.onChange(`${hours}:${minutes}`);
    }
  }

  private subscribeOnDurationChange() {
    this.validateDuration(this.hoursControl, (value: number) => this.inRange(value, 0, 24));
    this.validateDuration(this.minutesControl, (value: number) => this.inRange(value, 0, 59));
  }

  private validateDuration(control: FormControl, validator: (value: number) => number) {
    control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((duration) => {
      if (!duration) {
        this.updateDuration();
        return;
      }

      const parsedValue = parseInt(duration, 10);
      const nextValue = isNaN(parsedValue) ? duration.replace(/\D/g, '') : validator(parsedValue);
      control.patchValue(nextValue, { emitEvent: false });
      this.updateDuration();
    });
  }

  private inRange(value: number, from: number, to: number) {
    if (value > to) {
      return to;
    } else if (value < from) {
      return from;
    } else {
      return value;
    }
  }
}
