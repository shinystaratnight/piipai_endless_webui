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
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-input',
  templateUrl: 'form-input.component.html'
})

export class FormInputComponent extends BasicElementComponent implements OnInit, AfterViewInit {
  @ViewChild('input')
  public input;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    if (this.config.value) {
      this.group.get(this.key).patchValue(this.config.value);
    }
  }

  public ngAfterViewInit() {
    this.addFlags(this.input, this.config);
  }

  public eventHandler(e) {
    if (!this.config.templateOptions.readonly
      && this.group.get(this.key).value
      && !this.config.read_only) {
      this.event.emit({
        type: e.type,
        el: this.config,
        value: this.group.get(this.key).value
      });
    }
  }
}
