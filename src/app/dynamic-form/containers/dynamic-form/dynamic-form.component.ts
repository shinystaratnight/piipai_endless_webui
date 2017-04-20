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
  public data = null;

  @Output()
  public submit: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.form = this.fb.group({});
  }

  public ngOnChanges() {
    this.checkMetadata();
    this.addData(this.data, this.config);
  }

  public handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit(this.form.value);
  }

  public checkMetadata() {
    const config = [];
    this.config.forEach((el) => {
      if (!el.read_only) {
        config.push(el);
      }
    });
    this.config = config;
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public addData(data, config) {
    if (data && config) {
      config.forEach((el) => {
        if (el.key) {
          data.forEach((elem) => {
            if (elem.key === el.key) {
              el.value = elem.value;
              el.templateOptions.readonly = elem.readonly;
            }
          });
        }
        if (el.children) {
          this.addData(data, el.children);
        }
      });
    }
  }
}
