import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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

  @ViewChild('element')
  public element: any;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  public view: Rule[];
  public id: number;
  public addType: string;
  public elementValue: string;
  public app: string;
  public model: string;
  public ruleArray: any[];
  public statesArray: any[];
  public appsArray: any[];
  public modelsArray: any[];
  public functionsArray: any[];
  public editRule: any;
  public choice: string;
  public editIndex: number;
  public previewRule: any[];
  public activeStatesConfig: any[];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super();
  }

  public ngOnInit(): void {
    this.addControl(this.config, this.fb);
    this.view = [];
    this.id = 0;
    this.ruleArray = [];
    this.previewRule = [];
  }

  public addNewRule(): void {
    if (this.view) {
      if (this.view.length === 0 || this.view[this.view.length - 1].values.length > 1) {
        this.id += 1;
        this.view.push({
          id: this.id,
          operator: 'or',
          values: []
        });
      }
    }
  }

  public open(content, type, rule, index = null) {
    this.addType = type || 'new';
    this.editRule = rule;
    this.choice = '';
    if (rule && rule.values[index]) {
      this.editIndex = index;
    }
    if (type === 'state' || type === 'function') {
      this.choice = type;
      this.ruleArray = this.prepareRuleArray(type, rule.id);
    }
    this.modalService.open(content);
  }

  public done(closeModal, type) {
    closeModal();
    let choiceType;
    if (type) {
      choiceType = type === 'rule' ? this.addType : type;
      this.editRule.type = choiceType;
    }
    if (this.elementValue) {
      if (this.editRule && this.editRule.values[this.editIndex]) {
        this.editRule.values[this.editIndex] = this.elementValue;
      } else {
        this.editRule.values.push(this.elementValue);
      }
    }
    this.reset();
  }

  public delete(closeModal) {
    closeModal();
  }

  public reset() {
    this.editRule = null;
    this.editIndex = null;
    this.ruleArray = [];
    this.choice = '';
    this.elementValue = '';
  }

  public prepareRuleArray(type, currentId): any[] {
    let array = [];
    this.view.forEach((el) => {
      if (el.type && el.type === type && el.id < currentId) {
        array.push({
          id: el.id,
          name: `#${el.id}`
        });
      }
    });
    return array;
  }

  public showPreview() {
    this.previewRule = [];
    let types = ['state', 'function'];
    types.forEach((el) => {
      let ruleArray = this.view.filter((elem) => elem.type === el);
      let lastElement = ruleArray.pop();
      let parsedRuleValue = this.parseValue(lastElement);
      this.previewRule.push({
        label: el[0].toUpperCase() + el.slice(1),
        value: this.generateStringOfValues(parsedRuleValue)
      });
    });
  }

  public parseValue(item): any[] {
    let parseRule;
    if (item && item.values) {
      parseRule = item.values.map((el) => {
        if (el[0] === '#') {
          let rule = this.view.filter((elem) => +elem.id === +el.slice(1))[0];
          el = this.parseValue(rule);
        }
        return el;
      });
      parseRule.unshift(item.operator);
    }
    return parseRule;
  }

  public generateStringOfValues(array): string {
    let value = '';
    let operator;
    if (array) {
      operator = array.shift();
      let newArray = array.map((el) => {
        if (Array.isArray(el)) {
          el = this.generateStringOfValues(el);
          return el;
        }
        return `"${el}"`;
      });
      value += newArray.join(` ${operator} `);
    }
    return `( ${value} )`;
  }

}
