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
  ListTextComponent,
  ListLinkComponent,
  ListCheckboxComponent,
  ListImageComponent,
  ListInfoComponent,
  ListTagsComponent,
  ListSkillsComponent,
  ListFillinTagsComponent,
  ListAvailableComponent
} from '../components/list-elements';

import { InfoComponent } from '../components/info/info.component';
import { ButtonGroupComponent } from '../containers/button-group/button-group.component';
import { ListColumnComponent } from '../containers/list-column/list-column.component';
import { FormButtonComponent } from '../components/form-elements';

const components = {
  text: ListTextComponent,
  column: ListColumnComponent,
  link: ListLinkComponent,
  input: ListTextComponent,
  static: ListTextComponent,
  checkbox: ListCheckboxComponent,
  select: ListCheckboxComponent,
  button: FormButtonComponent,
  datetime: ListTextComponent,
  related: ListTextComponent,
  picture: ListImageComponent,
  icon: ListImageComponent,
  date: ListTextComponent,
  time: ListTextComponent,
  datepicker: ListTextComponent,
  textarea: ListTextComponent,
  info: ListInfoComponent,
  tags: ListTagsComponent,
  skills: ListSkillsComponent,
  description: InfoComponent,
  fillintags: ListFillinTagsComponent,
  available: ListAvailableComponent,
  buttonGroup: ButtonGroupComponent
};

@Directive({
  selector: '[appListElement]'
})
export class ListElementDirective implements OnInit, OnChanges {
  @Input()
  public config;

  @Input()
  public last;

  @Input()
  public length;

  @Input()
  public head;

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
    }
  }

  public ngOnInit() {
    if (this.config.type) {
      const component = components[this.config.type];
      const factory = this.resolver.resolveComponentFactory<any>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.config = this.config;
      this.component.instance.last = this.last;
      this.component.instance.length = this.length;
      this.component.instance.event = this.event;
      this.component.instance.buttonAction = this.buttonAction;
    } else if (this.config.length || this.config.name) {
      const component = components['column'];
      const factory = this.resolver.resolveComponentFactory<any>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.config = this.config;
      this.component.instance.last = this.last;
      this.component.instance.length = this.length;
      this.component.instance.head = this.head;
      this.component.instance.event = this.event;
      this.component.instance.buttonAction = this.buttonAction;
    }
  }
}
