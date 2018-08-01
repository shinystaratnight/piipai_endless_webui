import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Field } from '../../models/field.model';
import { CustomEvent } from '../../models/custom-event.model';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})

export class DynamicFormComponent implements OnInit {
  @Input() public config: Field[] = [];
  @Input() public errors: any = {};
  @Input() public message: any = {};
  @Input() public data: any;
  @Input() public commonFields: any;
  @Input() public hiddenFields: any;
  @Input() public formId: number;
  @Input() public form: FormGroup;

  @Output() public submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() public formChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() public event: EventEmitter<any> = new EventEmitter();
  @Output() public buttonAction: EventEmitter<any> = new EventEmitter();
  @Output() public resourseData: EventEmitter<any> = new EventEmitter();
  @Output() public changeValue: EventEmitter<any> = new EventEmitter();

  public currentForm: any;
  public fullData: any;

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.form = this.form || this.fb.group({});
    this.currentForm = this.config;
  }

  public getValues(data, list) {
    let values = {};
    if (list) {
      list.forEach((el) => {
        values[el] = this.getValue(data, el);
      });
    }
    return values;
  }

  public getValue(data, key) {
    if (data) {
      if (key.indexOf('.') > -1) {
        let keys = key.split('.');
        return this.getValue(data.get(keys.shift()), keys.join('.'));
      } else {
        return data.get(key).value;
      }
    }
  }

  public handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.invalid) {
      return;
    }
    let data = this.form.value;
    if (this.hiddenFields) {
      this.removeValuesOfHiddenFields(this.hiddenFields.elements, data);
    }
    this.filterSendData(this.config, data);
    this.submit.emit(data);
  }

  public eventHandler(e: CustomEvent): void {
    this.event.emit(e);

    if (e.type === 'change') {
      this.changeValue.emit(this.form.value);
    }
    let key;
    if (e.el) {
      key = e.el.type === 'related' ? e.el.key + '.id' : e.el.key;
    }
    setTimeout(() => {
      if (e.el && e.el.formData) {
        if (
          (e.type === 'change' || e.type === 'create' || e.type === 'blur')
          && e.el
          && e.el.key
          && e.el.key !== 'address'
        ) {
          const newData = this.generateData(e.el.key, e.el.formData.getValue().data, e);
          this.fullData = newData;
          if (this.hiddenFields && this.hiddenFields.observers.indexOf(key) > -1) {
            this.parseConfig(this.hiddenFields.elements);
          }
          e.el.formData.next({
            key: e.el.key,
            data: newData
          });
        }
      }
    }, 50);
  }

  public generateData(key: string, data = {}, event: CustomEvent): any {
    const keys = key.split('.');
    const firstKey = keys.shift();

    if (keys.length === 0) {
      if (event.el.type === 'related' && firstKey !== 'id') {
        if (data[firstKey]) {
          data[firstKey] = {
            ...data[firstKey],
            ...event.additionalData
          };
        } else {
          data[firstKey] = {
            id: event.value,
            ...event.additionalData
          };
        }
      } else {
        data[firstKey] = event.value;
      }
    } else {
      if (data[firstKey]) {
        this.generateData(keys.join('.'), data[firstKey], event);
      } else {
        data[firstKey] = {};
        this.generateData(keys.join('.'), data[firstKey], event);
      }
    }

    return data;
  }

  public parseConfig(metadata: Field[]) {
    metadata.forEach((el: Field) => {
      this.checkHiddenFields(el);
      if (el.children) {
        this.parseConfig(el.children);
      }
    });
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public resourseDataHandler(e) {
    this.resourseData.emit(e);
  }

  public checkHiddenFields(field: Field): void {
    let rule = field.showIf;
    let show = this.checkShowRules(rule);
    field.hidden.next(!show);
  }

  public checkShowRules(rule: any[]): boolean {
    let approvedRules = 0;
    let rulesNumber = rule.length;
    let data = this.fullData;

    rule.forEach((el: any) => {
      if (typeof el === 'string') {
        let value = this.getValueByKey(el, data);

        if (value && value !== '0') {
          approvedRules += 1;
        } else {
          return;
        }
      } else if (el instanceof Object) {
        let key = Object.keys(el)[0];
        let targetValue = el[key];
        let value = this.getValueByKey(key, data);

        if (value === targetValue) {
          approvedRules += 1;
        } else {
          return;
        }
      }
    });

    return approvedRules === rulesNumber;
  }

  public getValueByKey(key: string, data: any): any {
    let keysArray = key.split('.');
    let firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      return data && data[firstKey];
    } else if (keysArray.length > 0) {
      let combineKeys = keysArray.join('.');
      return this.getValueByKey(combineKeys, data[firstKey]);
    }
  }

  public removeValuesOfHiddenFields(metadata: Field[], data): void {
    metadata.forEach((el: Field) => {
      if (el.hide && el.key && !el.saveField) {
        this.removeValue(el.key, data);
      }
    });
  }

  public removeValue(key: string, data: any): void {
    let keysArray = key.split('.');
    let firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      if (data) {
        delete data[firstKey];
      }
    } else if (keysArray.length > 0) {
      let combineKeys = keysArray.join('.');
      this.removeValue(combineKeys, data[firstKey]);
    }
  }

  public filterSendData(metadata: Field[], data) {
    metadata.forEach((el) => {
      if (el.send === false && !el.saveField) {
        this.removeValue(el.key, data);
      } else if (el.children) {
        this.filterSendData(el.children, data);
      }
    });
  }

 }
