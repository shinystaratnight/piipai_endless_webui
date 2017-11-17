import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

import { Field } from '../../models/field.model';
import { CustomEvent } from '../../models/custom-event.model';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit, OnChanges {
  @Input()
  public config: Field[] = [];

  @Input()
  public errors: any = {};

  @Input()
  public message: any = {};

  @Input()
  public data: any;

  @Input()
  public commonFields: any;

  @Input()
  public hiddenFields: any;

  @Output()
  public submit: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public formChange: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  @Output()
  public resourseData: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;
  public currentForm: any;

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.form = this.fb.group({});
    this.currentForm = this.config;
  }

  public ngOnChanges() {
    this.addData(this.data, this.form);
    if (this.config !== this.currentForm && this.currentForm !== undefined) {
      this.currentForm = this.config;
      let oldValues = this.getValues(this.form, this.commonFields);
      this.formChange.emit(oldValues);
      this.form = this.fb.group({});
    }
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
    let data = this.form.value;
    this.removeValuesOfHiddenFields(this.hiddenFields.elements, data);
    this.submit.emit(data);
  }

  public eventHandler(e: CustomEvent): void {
    this.event.emit(e);
    if (this.hiddenFields && this.hiddenFields.elements && this.hiddenFields.elements.length) {
      this.parseConfig(this.hiddenFields.elements);
    }
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

  public addData(data, form) {
    if (data && form) {
      let keys = Object.keys(data);
      keys.forEach((el) => {
        if (el.indexOf('.') > -1) {
          this.updateForm(el.split('.'), data, form, el);
        } else {
          this.updateForm([el], data, form, el);
        }
      });
    }
  }

  public updateForm(keys, data, form, field) {
    let key = keys.shift();
    if (keys.length === 0) {
      if (data[field].action === 'update') {
        form.get(key).patchValue(data[field].value);
      }
    } else {
      this.updateForm(keys, data, form.get(key), field);
    }
  }

  public checkHiddenFields(field: Field): void {
    let rule = field.showIf;
    let show = this.checkShowRules(rule);
    field.hidden.next(!show);
  }

  public checkShowRules(rule: any[]): boolean {
    let approvedRules = 0;
    let rulesNumber = rule.length;
    let data = this.form.value;

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
      return data[firstKey];
    } else if (keysArray.length > 0) {
      let combineKeys = keysArray.join('.');
      return this.getValueByKey(combineKeys, data[firstKey]);
    }
  }

  public removeValuesOfHiddenFields(metadata: Field[], data): void {
    metadata.forEach((el: Field) => {
      if (el.hide) {
        this.removeValue(el.key, data);
      }
    });
  }

  public removeValue(key: string, data: any): void {
    let keysArray = key.split('.');
    let firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      delete data[firstKey];
    } else if (keysArray.length > 0) {
      let combineKeys = keysArray.join('.');
      this.removeValue(combineKeys, data[firstKey]);
    }
  }

 }
