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

  @Output()
  public submit: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  @Output()
  public resourseData: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.form = this.fb.group({});
  }

  public ngOnChanges() {
    this.addData(this.data, this.form);
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
        this.updateForm(el.split('.'), data, form, el);
      });
    }
  }

  public updateForm(keys, data, form, field) {
    let key = keys.shift();
    if (keys.length === 0) {
      if (this.data[field].action === 'update') {
        form.get(key).patchValue(this.data[field].value);
      }
    } else {
      this.updateForm(keys, data, form.get(key), field);
    }
  }
}
