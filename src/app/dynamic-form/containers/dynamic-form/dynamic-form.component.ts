import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit, OnChanges {
  @Input()
  public config: any[] = [];

  @Input()
  public errors: any = {};

  @Input()
  public message: any = {};

  @Input()
  public data: any;

  @Input()
  public commonFields: any;

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
    this.submit.emit(this.form.value);
  }

  public eventHandler(e) {
    this.event.emit(e);
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
}
