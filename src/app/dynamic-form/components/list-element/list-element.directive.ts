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

import { ListTextComponent } from './../list-text/list-text.component';
import { ListColumnComponent } from './../../containers/list-column/list-column.component';
import { ListLinkComponent } from './../list-link/list-link.component';

const components = {
  text: ListTextComponent,
  column: ListColumnComponent,
  link: ListLinkComponent
};

@Directive({
  selector: '[listElement]'
})
export class ListElementDirective implements OnInit, OnChanges {
  @Input()
  public config;

  @Input()
  public head;

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
    if (this.config.type) {
      const component = components[this.config.type];
      const factory = this.resolver.resolveComponentFactory<any>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.config = this.config;
    } else if (this.config.length || this.config.name) {
      const component = components['column'];
      const factory = this.resolver.resolveComponentFactory<any>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.config = this.config;
      this.component.instance.head = this.head;
    }
  }
}
