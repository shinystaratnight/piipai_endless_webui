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
import { FilterSelectComponent } from './../filter-select/filter-select.component';
import { FilterRangeComponent } from '../filter-range/filter-range.component';
import { FilterMultipleComponent } from '../filter-multiple/filter-multiple.component';

const components = {
  date: FilterDateComponent,
  choice: FilterChoiceComponent,
  related: FilterRelatedComponent,
  select: FilterSelectComponent,
  text: FilterRangeComponent,
  multiple: FilterMultipleComponent
};

@Directive({
  selector: '[filterElement]'
})
export class FilterElementDirective implements OnInit, OnChanges {
  @Input()
  public config;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public component: ComponentRef<any>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  public ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.event = this.event;
    }
  }

  public ngOnInit() {
    if (this.config.type !== 'search') {
      const component = components[this.config.type];
      const factory = this.resolver.resolveComponentFactory<any>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.config = this.config;
      this.component.instance.event = this.event;
    }
  }
}
