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
  public data: OutputData;
  public editValue: string;

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
    this.data = <any> {};
    if (this.config.value) {
      this.data = this.config.value;
      this.generateView(this.data);
      this.group.get(this.key).patchValue(this.data);
    } else {
      this.config.activeMetadata[0].value = null;
      this.view = [];
      this.group.get(this.key).patchValue(null);
    }
  }

  public addNewRule(): void {
    if (this.view) {
      if (this.view.length === 0 || this.view[this.view.length - 1].values.length > 0) {
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
    this.editValue = '';
    this.editIndex = null;

    this.app = '';
    this.model = '';
    this.elementValue = '';
    this.config.model = null;
    this.config.function = null;
    this.modelsArray = null;
    this.functionsArray = null;

    if (rule && rule.values[index]) {
      this.editIndex = index;
      this.editValue = rule.values[index];
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
    if (this.elementValue && this.editRule) {
      if (type) {
        choiceType = type === 'rule' ? this.addType : type;
        this.editRule.type = choiceType;
      }
      if (this.editRule.values[this.editIndex]) {
        this.editRule.values[this.editIndex] = this.elementValue;
      } else {
        this.editRule.values.push(this.elementValue);
      }
    }
    this.reset();
    this.generateData(this.view);
  }

  public delete(closeModal) {
    closeModal();
    let edit = this.editRule;
    edit.values.splice(this.editIndex, 1);
    if (!edit.values.length) {
      edit.type = null;
    }
    this.reset();
  }

  public reset() {
    this.editRule = null;
    this.editIndex = null;
    this.ruleArray = [];
    this.choice = '';
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
        value: this.generateStringOfValues(parsedRuleValue, el)
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
        if (item.type === 'state') {
          let state = this.config.options.filter((elem) => elem.name_before_activation === el)[0];
          if (state) {
            el = state.number;
          }
        }
        return el;
      });
      if (parseRule.length > 1) {
        parseRule.unshift(item.operator);
      }
    }
    return parseRule;
  }

  public generateStringOfValues(array, type = ''): string {
    let value = '';
    let operator;
    if (array) {
      operator = (array.length > 1) ? array.shift() : null;
      let newArray = array.map((el) => {
        if (Array.isArray(el)) {
          el = this.generateStringOfValues(el, type);
          return el;
        }
        if (type === 'state') {
          let stateObj = this.config.options.filter((elem) => +elem.number === +el)[0];
          if (stateObj) {
            el = stateObj.name_before_activation;
          }
        }
        return `"${el}"`;
      });
      value += (operator) ? newArray.join(` ${operator} `) : newArray.toString();
    }
    return `( ${value} )`;
  }

  public generateArray(type) {
    let props = {
      app: 'appsArray',
      model: 'modelsArray',
      function: 'functionsArray',
      options: 'statesArray'
    };
    if (type === 'function' || type === 'options') {
      let existValues = this.editRule.values;
      this[props[type]] = this.config[type].filter((el) => {
        return (type === 'options') ? existValues.indexOf(el.name_before_activation) === -1 :
          existValues.indexOf(el) === -1;
      });
    } else {
      this[props[type]] = [].concat(this.config[type]);
    }
  }

  public getRelatedData(type) {
    let params = {
      model: {
        param: 'app',
        query: `?app_name=`,
        endpoint: '/ecore/api/v2/models/'
      },
      function: {
        param: 'model',
        query: `?app_name=${this.app}&model_name=`,
        endpoint: '/ecore/api/v2/functions/'
      }
    };
    if (type === 'model') {
      this.model = null;
      this.elementValue = null;
      delete this.config.model;
      delete this.config.function;
    } else if (type === 'function') {
      this.elementValue = null;
      delete this.config.function;
    }
    this.event.emit({
      type: 'change',
      el: {
        endpoint: params[type].endpoint,
        type: 'rule',
        related: {
          field: 'rules',
          param: params[type].param,
          query: params[type].query,
          prop: type
        }
      },
      value: [{ [params[type].param]: this[params[type].param] }]
    });
  }

  public generateData(view) {
    let types = ['state', 'function'];
    types.forEach((el) => {
      let ruleArray = this.view.filter((elem) => elem.type === el);
      let lastElement = ruleArray.pop();
      let parsedRuleValue = this.parseValue(lastElement);
      if (parsedRuleValue) {
        if (el === 'state') {
          this.data.required_states = parsedRuleValue;
        } else if (el === 'function') {
          this.data.required_functions = parsedRuleValue;
        }
      }
    });
    this.group.get(this.key).patchValue(this.data);
  }

  public changeActiveStates(e) {
    if (e && e.list) {
      this.data.active = e.list.map((el) => {
        return el.number;
      });
    }
    this.generateData(this.view);
  }

  public generateView(data) {
    let attr = Object.keys(data);
    attr.forEach((el) => {
      if (el === 'active') {
        this.config.activeMetadata[0].value = data[el];
      } else {
        let type;
        if (el === 'required_states') {
          type = 'state';
        } else if (el === 'required_functions') {
          type = 'function';
        }
        this.generateDataForView([].concat(data[el]), type);
      }
    });
  }

  public generateDataForView(data, type) {
    if (data.length === 0) {
      this.createElement(undefined, 'or', this.id += 1, data);
      return;
    }
    if (this.config.options) {
      let operator = (data.length === 1) ? 'or' : data.shift();
      let newData = data.map((el, i) => {
        if (Array.isArray(el)) {
          let id = this.generateDataForView(el, type);
          let nemElement = `#${id}`;
          return nemElement;
        }
        if (type === 'state') {
          let obj = this.config.options.filter((prop) => prop.number === el)[0];
          if (obj) {
            el = obj.name_before_activation;
          }
        }
        return el;
      });
      this.createElement(type, operator, this.id += 1, newData);
      return this.id;
    }
  }

  public createElement(type, operator, id, values) {
    this.view.push({ id, type, operator, values });
  }

}
