import {
  Directive,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnInit,
  ComponentRef,
  OnChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormRowComponent } from './../../containers/form-row/form-row.component';
import { FormButtonComponent } from './../form-button/form-button.component';

const components = {
  input: FormInputComponent,
  row: FormRowComponent,
  button: FormButtonComponent
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
    }
  }

  public ngOnInit() {
    const component = components[this.config.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
    this.component.instance.errors = this.errors;
  }
}
