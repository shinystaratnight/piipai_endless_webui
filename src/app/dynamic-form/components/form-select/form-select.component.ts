import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'form-select',
  templateUrl: 'form-select.component.html'
})

export class FormSelectComponent implements OnInit, AfterViewInit {
  @ViewChild('select')
  public select;

  public config;
  public group: FormGroup;
  public errors: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {}

  public ngOnInit() {
    this.group.addControl(this.config.key, this.fb.control(''));
  }

  public ngAfterViewInit() {
    this.select.nativeElement.required = this.config.templateOptions.required;
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.get(this.config.key).value
    });
  }
}
