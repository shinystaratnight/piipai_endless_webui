import {
  Directive,
  Input,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnInit,
  ComponentRef,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  FilterDateComponent,
  FilterRelatedComponent,
  FilterSelectComponent,
  FilterRangeComponent,
  FilterMultipleComponent,
  FilterLimitComponent
} from '../components/filter-elements';

const components: Record<string, any> = {
  date: FilterDateComponent,
  checkbox: FilterMultipleComponent,
  related: FilterRelatedComponent,
  select: FilterSelectComponent,
  text: FilterRangeComponent,
  multiple: FilterMultipleComponent,
  range: FilterLimitComponent
};

@Directive({
  selector: '[webuiFilterElement]'
})
export class FilterElementDirective implements OnInit, OnChanges {
  @Input()
  public config: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public component!: ComponentRef<any>;

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
