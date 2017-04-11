import {
  Directive,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';

const components = {
  input: FormInputComponent
};

@Directive({
  selector: '[formElement]'
})
export class FormElementDirective implements OnInit {
  @Input()
  public config;

  @Input()
  public group: FormGroup;

  public component;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  public ngOnInit() {
    const component = components[this.config.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }
}
