import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-datepicker',
  templateUrl: 'form-datepicker.component.html'
})

export class FormDatepickerComponent
  extends BasicElementComponent
  implements OnInit, AfterViewInit {

  @ViewChild('d')
  public d;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public time: any;

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
  }

  public ngAfterViewInit() {
    this.addFlags(this.d, this.config);
  }

  public datepicker() {
    return true;
  }
}
