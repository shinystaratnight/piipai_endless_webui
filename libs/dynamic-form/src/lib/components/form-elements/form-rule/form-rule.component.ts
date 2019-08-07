import { Component, OnInit, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  data: any[];
}

@Component({
  selector: 'app-form-rule',
  templateUrl: './form-rule.component.html',
  styleUrls: ['./form-rule.component.scss']
})
export class FormRuleComponent extends BasicElementComponent implements OnInit, OnDestroy {

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild('element', { static: false })
  public element: any;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;

  public elementValue: string;
  public app: string;
  public model: string;
  public statesArray: any[];
  public appsArray: any[];
  public modelsArray: any[];
  public functionsArray: any[];

  public editRule: any;
  public parentRule: any;
  public editItem: any;
  public choice: string;
  public editIndex: number;
  public data: OutputData;
  public editValue: string;

  public modalRef: any;

  public states: any;
  public functions: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    super();
  }

  public ngOnInit(): void {
    this.addControl(this.config, this.fb);
    this.data = <any> {};
    if (this.config.value && Object.keys(this.config.value).length) {
      this.data = JSON.parse(JSON.stringify(this.config.value));
      this.generateView(this.data);
      this.group.get(this.key).patchValue(this.data);
    } else {
      this.config.activeMetadata[0].value = null;

      this.states = this.createRule();
      this.functions = this.createRule();
      this.group.get(this.key).patchValue(null);
    }
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public open(content, type, rule, index = null, item, parent) {
    this.editRule = rule;
    this.choice = '';
    this.editValue = '';
    this.editIndex = null;
    this.editItem = item;
    this.parentRule = parent;

    this.app = '';
    this.model = '';
    this.elementValue = '';
    this.config.model = null;
    this.config.function = null;
    this.modelsArray = null;
    this.functionsArray = null;

    if (rule && rule[index]) {
      this.editIndex = index;
      this.editValue = rule[index];
    }
    if (type === 'state' || type === 'function') {
      this.choice = type;
    }
    this.modalRef = this.modalService.open(content);
  }

  public done(closeModal, type) {
    closeModal();
    if (this.elementValue && this.editRule) {
      if (this.editRule[this.editIndex]) {
        this.editRule[this.editIndex] = this.elementValue;
      } else {
        this.editRule.push(this.elementValue);
      }
    }
    this.reset();
    this.generateData(type);
  }

  public delete(closeModal, type) {
    closeModal();
    this.editRule.splice(this.editIndex, 1);
    if (this.editRule.length === 0) {
      if (Array.isArray(this.parentRule)) {
        const index = this.parentRule.indexOf(this.editItem);

        if (index > -1) {
          this.parentRule.splice(index, 1);
        }
      }
    }
    this.generateData(type);
    this.reset();
  }

  public reset() {
    this.editRule = null;
    this.parentRule = null;
    this.editIndex = null;
    this.editItem = null;
    this.choice = '';
  }

  public parseValue(data: any, type?) {
    let parseValue;

    if (data && data.data) {
      parseValue = data.data.map((el) => {
        if (el) {
          if (el instanceof Object) {
            el = this.parseValue(el, type);
          }

          if (type === 'state') {
            const state = this.config.options.find((elem) => elem.name_before_activation === el);
            if (state) {
              el = state.number;
            }
          }

          return el;
        }
      });

      if (parseValue.length > 1) {
        parseValue.unshift(data.operator);
      }
    }

    return parseValue;
  }

  public generateArray(type) {
    const props = {
      app: 'appsArray',
      model: 'modelsArray',
      function: 'functionsArray',
      options: 'statesArray'
    };

    this[props[type]] = [].concat(this.config[type]);
  }

  public getRelatedData(type) {
    const params = {
      model: {
        param: 'app',
        query: `?app_name=`,
        endpoint: '/models/'
      },
      function: {
        param: 'model',
        query: `?app_name=${this.app}&model_name=`,
        endpoint: '/functions/'
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

  public generateData(type: string) {
    if (type === 'state') {
      this.data.required_states = this.parseValue(this.states, type);
    }

    if (type === 'function') {
      this.data.required_functions = this.parseValue(this.functions);
    }

    this.group.get(this.key).patchValue(this.data);
  }

  public changeActiveStates(e) {
    if (e && e.list) {
      this.data.active = e.list.map((el) => {
        return el.number;
      });
    }
    this.group.get(this.key).patchValue(this.data);
  }

  public generateView(data) {
    const attr = Object.keys(data);
    attr.forEach((el) => {
      if (el === 'active') {
        this.config.activeMetadata[0].value = data[el];
      } else {
        let type;
        if (el === 'required_states') {
          type = 'state';

          this.states = this.generateViewForType([].concat(data[el]));
        } else if (el === 'required_functions') {
          type = 'function';

          this.functions = this.generateViewForType([].concat(data[el]));
        }
      }
    });

    if (!this.states) {
      this.states = this.createRule();
    }

    if (!this.functions) {
      this.functions = this.createRule();
    }
  }

  public generateViewForType(data: any[], type?) {
    const operator = data.length > 1 ? data.shift() : 'or';

    const element = {
      type,
      operator,
      data: [],
    };

    data.forEach((el) => {
      if (Array.isArray(el)) {
        const nestedType = 'rule';

        element.data.push(this.generateViewForType([].concat(el), nestedType));
      } else {
        if (this.config.options) {
          const obj = this.config.options.find((prop) => prop.number === el);
          if (obj) {
            el = obj.name_before_activation;
          }
        }

        element.data.push(el);
      }
    });

    return element;
  }

  public createRule(type?) {
    return {
        type: type || '',
        operator: 'or',
        data: [],
    };
  }

  public addRule(target: any) {
    target.push(this.createRule('rule'));
  }

  public isObject(target: any): boolean {
    return target instanceof Object;
  }

  public changeOperator(e, type) {
    e.preventDefault();
    e.stopPropagation();

    this.generateData(type);
  }

  public resetRule(type: string) {
    if (type === 'state') {
      if (this.config.value && this.config.value.required_states) {
        this.states = this.generateViewForType([].concat(this.config.value.required_states));
        this.data.required_states = JSON.parse(JSON.stringify(this.config.value.required_states));
      } else {
        this.states = this.generateViewForType([]);
        this.data.required_states = null;
      }
    }

    if (type === 'function') {
      if (this.config.value && this.config.value.required_functions) {
        this.functions = this.generateViewForType([].concat(this.config.value.required_functions));
        this.data.required_functions =
          JSON.parse(JSON.stringify(this.config.value.required_functions));
      } else {
        this.functions = this.generateViewForType([]);
        this.data.required_functions = null;
      }
    }

    this.group.get(this.key).patchValue(this.data);
  }

}
