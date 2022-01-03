import { Component, OnInit, ChangeDetectionStrategy, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'webui-form-input-control',
  templateUrl: './form-input-control.component.html',
  styleUrls: ['./form-input-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputControlComponent),
      multi: true
    }
  ]
})
export class FormInputControlComponent implements OnInit, ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type = 'text';

  public value?: any = '';
  public onChange?: (value: any) => void;
  public onTouched?: () => void;

  constructor() {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {}
}
