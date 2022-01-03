import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { Icon, IconSize } from '@webui/icon';
import { DatepickerType } from '../../enums/datepicker.enum';
import { DateService } from '@webui/core';
import { DateFormat } from '@webui/data';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class FormDatepickerControlComponent implements OnInit, ControlValueAccessor {
  @Input() label?: string;
  @Input() type?: DatepickerType;
  @Input() initialValue?: string;
  @Input() timezone?: string;

  @Input() timerFrom?: string;
  @Input() timerTo?: string;

  public dateValue?: string;
  public timeValue?: string;
  public timerValue: string = '00h 00min';

  public Icon = Icon;
  public IconSize = IconSize;
  public value?: string;

  private onChange?: () => void;
  private onTouched?: () => void;

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

  constructor(private dateService: DateService) {}

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
  }

  private parseInitialValue(): void {
    if (!this.initialValue) {
      return;
    }

    const date = this.dateService.parse(this.initialValue, this.timezone);

    this.dateValue = date.format('YYYY-MM-DD');
    this.timeValue = date.format(DateFormat.Time);
  }

  private parseTimerInitialValue(): void {
    if (!this.timerFrom || !this.timerTo) {
      return;
    }

    const from = this.dateService.parse(this.timerFrom, this.timezone);
    const to = this.dateService.parse(this.timerTo, this.timezone);
    const diff = to.diff(from);
    const hours = to.diff(from, 'hours');
    const minutes = to.diff(to, 'minutes');

    this.timerValue = `${hours}h ${minutes}min`;
  }
}
