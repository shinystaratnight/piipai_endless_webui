import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';

import { Field } from '../../models/field.model';
import { CustomEvent } from '../../models/custom-event.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {
  @Input()
  public config: Field[] = [];
  @Input()
  public errors: any = {};
  @Input()
  public message: any = {};
  @Input()
  public data: any;
  @Input()
  public hiddenFields: any;
  @Input()
  public formId: number;
  @Input()
  public form: FormGroup;

  @Output()
  public submitForm: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public event: EventEmitter<any> = new EventEmitter();
  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();
  @Output()
  public resourseData: EventEmitter<any> = new EventEmitter();
  @Output()
  public changeValue: EventEmitter<any> = new EventEmitter();
  @Output()
  public formGroup: EventEmitter<FormGroup> = new EventEmitter();

  public currentForm: any;
  public fullData: any;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  public ngOnInit() {
    this.form = this.form || this.fb.group({});
    this.formGroup.emit(this.form);
    this.currentForm = this.config;
  }

  public getValues(data, list) {
    const values = {};
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
        const keys = key.split('.');
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
    const data = this.form.value;
    if (this.hiddenFields) {
      this.removeValuesOfHiddenFields(this.hiddenFields.elements, data);
    }
    this.filterSendData(this.config, data);
    this.submitForm.emit(data);
  }

  public eventHandler(e: CustomEvent): void {
    this.event.emit(e);

    if (e.type === 'change' || e.type === 'reset') {
      this.changeValue.emit(this.form.value);
    }
    let key;
    if (e.el) {
      key = e.el.type === 'related' ? e.el.key + '.id' : e.el.key;
    }
    setTimeout(() => {
      if (e.el && e.el.formData) {
        if (
          (e.type === 'change' ||
            e.type === 'reset' ||
            e.type === 'create' ||
            e.type === 'blur') &&
          e.el &&
          e.el.key &&
          (e.el.key !== 'address' || e.el.updateFormData)
        ) {
          const newData = this.generateData(
            e.el.key,
            e.el.formData.getValue().data,
            e
          );
          this.fullData = newData;
          if (
            this.hiddenFields &&
            this.hiddenFields.observers.indexOf(key) > -1
          ) {
            this.parseConfig(this.hiddenFields.elements);
          }
          if (e.type !== 'reset') {
            e.el.formData.next({
              key: e.el.key,
              data: this.fullData,
              reset: e.manual && e.el.reset,
              manual: e.manual
            });
          }
        }

        setTimeout(() => {
          if (!(<any> this.cd).destroyed) {
            this.cd.detectChanges();
          }
        }, 1000);
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
    this.buttonAction.emit({ ...e, data: this.form.value });
  }

  public resourseDataHandler(e) {
    this.resourseData.emit(e);
  }

  public checkHiddenFields(field: Field): void {
    const rule = field.showIf;
    const show = this.checkShowRules(rule);
    field.hidden.next(!show);
  }

  public checkShowRules(rule: any[]): boolean {
    let approvedRules = 0;
    const rulesNumber = rule.length;
    const data = this.fullData;

    rule.forEach((el: any) => {
      if (typeof el === 'string') {
        const value = this.getValueByKey(el, data);

        if (value && value !== '0') {
          approvedRules += 1;
        } else {
          return;
        }
      } else if (el instanceof Object) {
        const key = Object.keys(el)[0];
        const targetValue = el[key];
        const value = this.getValueByKey(key, data);

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
    const keysArray = key.split('.');
    const firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      return data && data[firstKey];
    } else if (keysArray.length > 0) {
      const combineKeys = keysArray.join('.');
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
    const keysArray = key.split('.');
    const firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      if (data) {
        delete data[firstKey];
      }
    } else if (keysArray.length > 0) {
      const combineKeys = keysArray.join('.');
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
