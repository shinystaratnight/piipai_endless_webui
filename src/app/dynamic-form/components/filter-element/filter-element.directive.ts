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

import { FilterDateComponent } from './../filter-date/filter-date.component';
import { FilterChoiceComponent } from './../filter-choice/filter-choice.component';
import { FilterRelatedComponent } from './../filter-related/filter-related.component';

const components = {
  date: FilterDateComponent,
  choice: FilterChoiceComponent,
  related: FilterRelatedComponent
};

@Directive({
  selector: '[filterElement]'
})
export class FilterElementDirective implements OnInit, OnChanges {
  @Input()
  public config;

  public component: ComponentRef<any>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  public ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
    }
  }

  public ngOnInit() {
    const component = components[this.config.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
  }
}
