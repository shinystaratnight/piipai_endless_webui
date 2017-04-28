import {
  Directive,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnInit,
  ComponentRef,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormRowComponent } from './../../containers/form-row/form-row.component';
import { FormButtonComponent } from './../form-button/form-button.component';
import { FormSelectComponent } from './../form-select/form-select.component';
import { FormDatepickerComponent } from './../form-datepicker/form-datepicker.component';
import { FormTextareaComponent } from './../form-textarea/form-textarea.component';
import { FormCollapseComponent } from './../../containers/form-collapse/form-collapse.component';
import { FormCheckboxComponent } from './../form-checkbox/form-checkbox.component';
import { FormRelatedComponent } from './../form-related/form-related.component';

const components = {
  input: FormInputComponent,
  row: FormRowComponent,
  button: FormButtonComponent,
  select: FormSelectComponent,
  datepicker: FormDatepickerComponent,
  textarea: FormTextareaComponent,
  collapse: FormCollapseComponent,
  checkbox: FormCheckboxComponent,
  related: FormRelatedComponent
};

@Directive({
  selector: '[formElement]'
})
export class FormElementDirective implements OnInit, OnChanges {
  @Input()
  public config;

  @Input()
  public group: FormGroup;

  @Input()
  public errors: any;

  @Input()
  public message: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public component: ComponentRef<any>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  public ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
      this.component.instance.errors = this.errors;
      this.component.instance.event = this.event;
      this.component.instance.message = this.message;
      this.component.instance.buttonAction = this.buttonAction;
    }
  }

  public ngOnInit() {
    const component = components[this.config.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
    this.component.instance.errors = this.errors;
    this.component.instance.event = this.event;
    this.component.instance.message = this.message;
    this.component.instance.buttonAction = this.buttonAction;
  }
}
