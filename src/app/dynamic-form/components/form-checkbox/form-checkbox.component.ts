import { Component, OnInit, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-checkbox',
  templateUrl: 'form-checkbox.component.html'
})

export class FormCheckboxComponent extends BasicElementComponent implements OnInit, AfterViewInit {

  @ViewChild('checkbox')
  public checkbox;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public value = true;
  public label: boolean;

  public checkboxValue: string;
  public checkboxClass: string = '';
  public checkboxColor: string = '';

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    if (!this.group.get(this.key).value && !this.config.read_only) {
      let value = this.config.defaultValue || false;
      this.group.get(this.key).patchValue(value);
    }
    if (this.config.read_only) {
      this.setValue(this.config.value);
    } else if (this.config.templateOptions.type === 'icon') {
      this.customizeCheckbox();
    }
    if (this.config.value || this.config.value === false || this.config.value === null) {
      this.group.get(this.key).patchValue(this.config.value);
    }
  }

  public setValue(value) {
    let values = this.config && this.config.templateOptions.values;
    if (values) {
      this.checkboxValue = values[value];
      this.checkboxClass = value === true ?
        'text-success' : value === false ?
        'text-danger' : 'text-muted';
    }
  }

  public customizeCheckbox() {
    let color = this.config.templateOptions.color;
    let classes = ['primary', 'danger', 'info', 'success', 'warning'];
    this.checkboxClass = classes.indexOf(color) > -1 ? `text-${color}` : '';
    if (!this.checkboxClass) {
      this.checkboxColor = color || '';
    }
  }

  public ngAfterViewInit() {
    if (this.checkbox) {
      this.addFlags(this.checkbox, this.config);
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.controls[this.key].value
    });
  }
}
