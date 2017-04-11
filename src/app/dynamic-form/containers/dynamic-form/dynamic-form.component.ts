import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit {
  @Input()
  public config: any[] = [];

  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.form = this.fb.group({});
  }
}
