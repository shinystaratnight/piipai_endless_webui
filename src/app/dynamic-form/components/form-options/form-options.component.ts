import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

interface Option {
  label: string|number;
  value: string|number;
}

@Component({
  selector: 'form-options',
  templateUrl: 'form-options.component.html'
})

export class FormOptionsComponent extends BasicElementComponent implements OnInit {

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  public optionsArray: Option[];

  constructor(
    private fb: FormBuilder,
  ) {
    super();
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.setInitValue();
    if (this.config && this.config.hidden) {
      this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }
      });
    }
    this.createEvent();
  }

  public setInitValue() {
    if (this.config.value) {
      this.optionsArray = this.config.value;
      this.group.get(this.key).patchValue(this.config.value);
    } else {
      this.optionsArray = [
        {
          label: '',
          value: ''
        }
      ];
    }
  }

  public updateValue() {
    let value = this.optionsArray.filter((el) => {
      if ((el.label || el.label === '0') && (el.value || el.value === '0')) {
        return true;
      }
    });
    if (value) {
      this.group.get(this.key).patchValue(value);
    }
  }

  public addOption() {
    this.optionsArray.push({
      label: '',
      value: ''
    });
  }

  public deleteOption(option) {
    this.optionsArray.splice(this.optionsArray.indexOf(option), 1);
    this.updateValue();
  }
}
