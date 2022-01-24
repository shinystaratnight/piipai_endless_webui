import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  forwardRef
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'webui-form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent implements OnInit {
  @Input() label?: string;
  @Input() placeholder?: string;

  public onChange?: (value: string) => void;
  public onTouched?: () => void;

  public control: FormControl = new FormControl();

  public ngOnInit() {
    this.control.valueChanges.subscribe((value) => {
      if (this.onChange) {
        this.onChange(value);
      }
    });
  }

  writeValue(value: string): void {
    this.control.patchValue(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    console.log('register');
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
