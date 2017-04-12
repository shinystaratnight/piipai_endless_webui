import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit {
  @Input()
  public config: any[] = [];

  @Input()
  public errors: any = {};

  @Output()
  public submit: EventEmitter<any> = new EventEmitter<any>();

  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.form = this.fb.group({});
    this.checkMetadata();
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
}
