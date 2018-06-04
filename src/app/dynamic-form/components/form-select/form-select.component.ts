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
  public options: any;
  public label: boolean;

  public displayValue: string;

  public viewMode: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.options = this.config.templateOptions.options.sort((p, n) => p.label > n.label ? 1 : -1 );
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.createEvent();
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }
      });
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
          this.group.get(this.key).patchValue(undefined);
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });
    }
  }

  public getValue(options: any[], value: string): string {
    let element = options.find((el) => el.value == value); // tslint:disable-line
    if (element) {
      return element.label;
    } else {
      return '-';
    }
  }

  public setInitValue() {
    if (this.config.value != undefined) { //tslint:disable-line
      this.group.get(this.key).patchValue(this.config.value);
    }
    if (this.viewMode && !this.config.hide) {
      this.displayValue = this.getValue(this.options, this.config.value);
    }
  }

  public ngAfterViewInit() {
    if (this.select) {
      this.addFlags(this.select, this.config);
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.group.get(this.key).value
    });
  }
}
