import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-textarea',
  templateUrl: 'form-textarea.component.html'
})

export class FormTextareaComponent extends BasicElementComponent implements OnInit, AfterViewInit {
  @ViewChild('textarea')
  public textarea;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;

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
    this.addFlags(this.textarea, this.config);
  }
}
