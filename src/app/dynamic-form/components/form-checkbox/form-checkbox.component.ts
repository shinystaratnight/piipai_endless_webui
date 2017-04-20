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

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
  }

  public ngAfterViewInit() {
    this.addFlags(this.checkbox, this.config);
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.controls[this.key].value
    });
  }
}
