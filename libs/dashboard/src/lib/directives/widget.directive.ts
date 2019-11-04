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

import {
  ButtonsWidget,
  CalendarWidgetComponent,
  CandidateWidget
} from '../components';
import { Type } from '../interfaces';

const components = {
  [Type.Buttons]: ButtonsWidget,
  [Type.Calendar]: CalendarWidgetComponent,
  [Type.Candidates]: CandidateWidget
};

@Directive({
  selector: '[appWidget]'
})
export class WidgetDirective implements OnInit, OnChanges {
  @Input() public config;

  @Output() public event: EventEmitter<any> = new EventEmitter();

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
    const component = components[this.config.type];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.event = this.event;
  }
}
