import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

interface OutputData {
  active: number[];
  required_states: number[]|string[];
  required_functions: number[]|string[];
}

interface Rule {
  id: number;
  type?: string;
  operator: string;
  values: number[]|string[];
}

@Component({
  selector: 'form-rule',
  templateUrl: 'form-rule.component.html'
})
export class FormRuleComponent extends BasicElementComponent implements OnInit {

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  public view: Rule[];
  public id: number;

  constructor(private fb: FormBuilder) {
    super();
  }

  public ngOnInit(): void {
    this.addControl(this.config, this.fb);
    this.view = [];
    this.id = 0;
  }

  public addNewElement(): void {
    this.id += 1;
    this.view.push({
      id: this.id,
      operator: 'or',
      values: []
    });
  }

}
