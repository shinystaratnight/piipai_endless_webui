import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  OnDestroy
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class FormTextareaComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private destroy: Subject<void> = new Subject();

  @Input() label?: string;
  @Input() placeholder?: string;

  public onChange?: (value: string) => void;
  public onTouched?: () => void;
  public control: FormControl = new FormControl();
  public destroy$: Observable<void> = this.destroy.asObservable();

  public ngOnInit() {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.onChange) {
          this.onChange(value);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public writeValue(value: string): void {
    this.control.patchValue(value);
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
