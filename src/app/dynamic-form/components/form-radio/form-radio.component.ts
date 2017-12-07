import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { BasicElementComponent } from '../basic-element/basic-element.component';

@Component({
  selector: 'form-radio',
  templateUrl: 'form-radio.component.html'
})

export class FormRadioComponent extends BasicElementComponent implements OnInit {

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public value: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    if (!this.group.get(this.key).value && !this.config.read_only) {
      this.value = this.config.default || '';
      this.group.get(this.key).patchValue(this.value);
    }
    if (this.config.value || this.config.value === false || this.config.value === null) {
      this.value = this.config.value;
      this.group.get(this.key).patchValue(this.value);
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.get(this.key).value
    });
  }
}