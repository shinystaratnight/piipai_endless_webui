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

import { FilterDateComponent } from '../components/filter-date/filter-date.component';
import { FilterChoiceComponent } from '../components/filter-choice/filter-choice.component';
import { FilterRelatedComponent } from '../components/filter-related/filter-related.component';
import { FilterSelectComponent } from '../components/filter-select/filter-select.component';
import { FilterRangeComponent } from '../components/filter-range/filter-range.component';
import { FilterMultipleComponent } from '../components/filter-multiple/filter-multiple.component';
import { FilterLimitComponent } from '../components/filter-limit/filter-limit.component';

const components = {
  date: FilterDateComponent,
  checkbox: FilterMultipleComponent,
  related: FilterRelatedComponent,
  select: FilterSelectComponent,
  text: FilterRangeComponent,
  multiple: FilterMultipleComponent,
  range: FilterLimitComponent
};

@Directive({
  selector: '[appFilterElement]'
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
