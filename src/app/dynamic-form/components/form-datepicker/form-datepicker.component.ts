import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'form-datepicker',
  templateUrl: 'form-datepicker.component.html'
})

export class FormDatepickerComponent implements OnInit, AfterViewInit {
  @ViewChild('d')
  public d;

  public config;
  public group: FormGroup;
  public errors: any;

  constructor(
    private fb: FormBuilder
  ) {}

  public ngOnInit() {
    this.group.addControl(this.config.key, this.fb.control(''));
  }

  public ngAfterViewInit() {
    this.d.nativeElement.required = this.config.templateOptions.required;
  }

  public datepicker() {
    return true;
  }
}
