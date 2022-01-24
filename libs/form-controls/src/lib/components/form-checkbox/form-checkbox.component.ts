import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Input
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'webui-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckboxComponent),
      multi: true
    }
  ]
})
export class FormCheckboxComponent implements OnInit {
  @Input() label?: string;

  public onChange?: (value: boolean) => void;
  public onTouched?: () => void;

  public control: FormControl = new FormControl();

  public ngOnInit() {
    this.control.valueChanges.subscribe((value) => {
      if (this.onChange) {
        this.onChange(value);
      }
    });
  }

  public writeValue(value: boolean): void {
    this.control.patchValue(value);
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
