import {
  Component,
  ViewContainerRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'form-input',
  templateUrl: 'form-input.component.html'
})

export class FormInputComponent implements OnInit, AfterViewInit {
  @ViewChild('input')
  public input;

  public config;
  public group: FormGroup;
  public errors: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {}

  public ngOnInit() {
    this.group.addControl(this.config.key, this.fb.control(''));
  }

  public ngAfterViewInit() {
    this.input.nativeElement.required = this.config.templateOptions.required;
    if (this.config.templateOptions.max) {
      this.input.nativeElement.maxLength = this.config.templateOptions.max;
    }
    if (this.config.templateOptions.min) {
      this.input.nativeElement.minLength = this.config.templateOptions.min;
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.get(this.config.key).value
    });
  }
}
