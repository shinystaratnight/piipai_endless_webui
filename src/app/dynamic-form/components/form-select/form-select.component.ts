import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-select',
  templateUrl: 'form-select.component.html'
})

export class FormSelectComponent extends BasicElementComponent implements OnInit, AfterViewInit {
  @ViewChild('select')
  public select;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    if (this.config.value) {
      this.group.get(this.key).patchValue(this.config.value);
    }
  }

  public ngAfterViewInit() {
    this.addFlags(this.select, this.config);
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.get(this.key).value
    });
  }
}
