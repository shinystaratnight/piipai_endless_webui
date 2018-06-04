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

  public viewMode: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.createEvent();
  }

  public checkHiddenProperty() {
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
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });
    }
  }

  public setInitValue() {
    let value = this.config.value || (this.viewMode === false && this.config.default); //tslint:disable-line
    if (this.viewMode) {
      if (this.config.templateOptions.type === 'checkbox') {
        this.defaultValues(value);
      }
    }
    if (this.config.templateOptions.type === 'icon') {
      this.customizeCheckbox(value);
    }
    this.group.get(this.key).patchValue(value || false);
  }

  public defaultValues(value) {
    if (value) {
      this.checkboxClass = 'text-success';
      this.checkboxValue = 'check-circle';
    } else if (value === null) {
      this.checkboxClass = 'text-muted';
      this.checkboxValue = 'minus-circle';
    } else {
      this.checkboxClass = 'text-danger';
      this.checkboxValue = 'times-circle';
    }
  }

  public customizeCheckbox(value): void {
    this.checkboxValue = this.config.templateOptions.values[value];
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
