import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

interface IOption {
  label: string;
  value: any;
}

@Component({
  selector: 'webui-form-radio-switch',
  templateUrl: './form-radio-switch.component.html',
  styleUrls: ['./form-radio-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormRadioSwitchComponent),
      multi: true
    }
  ]
})
export class FormRadioSwitchComponent implements OnInit, ControlValueAccessor {
  @Input() options!: IOption[];

  public onChange?: (value: any) => void;
  public onTouched?: () => void;

  public control: FormControl = new FormControl();

  public ngOnInit() {
    console.log(this);

    this.control.valueChanges.subscribe((value) => {
      console.log(value, this.onChange);
      if (this.onChange) {
        console.log(value);
        this.onChange(value);
      }
    });
  }

  writeValue(value: any): void {
    this.control.patchValue(value);
  }

  registerOnChange(fn: any): void {
    console.log('register');
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
