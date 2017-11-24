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
import { FormRuleComponent } from './../form-rule/form-rule.component';
import { FormTimelineComponent } from './../form-timeline/form-timeline.component';
import { FormPictureComponent } from './../form-picture/form-picture.component';
import { FormHiddenComponent } from './../../containers/form-hidden/form-hidden.component';
import { FormVacancyDatesComponent } from './../form-vacancy-dates/form-vacancy-dates.component';
import { FormListComponent } from './../form-list/form-list.component';
import { FormFieldsGroupComponent } from './../form-fields-group/form-fields-group.component';
import { FormOptionsComponent } from './../form-options/form-options.component';
import { FormJsonComponent } from './../form-json/form-json.component';

const components = {
  input: FormInputComponent,
  row: FormRowComponent,
  button: FormButtonComponent,
  select: FormSelectComponent,
  datepicker: FormDatepickerComponent,
  textarea: FormTextareaComponent,
  collapse: FormCollapseComponent,
  checkbox: FormCheckboxComponent,
  related: FormRelatedComponent,
  rule: FormRuleComponent,
  timeline: FormTimelineComponent,
  picture: FormPictureComponent,
  hidden: FormHiddenComponent,
  vacancydates: FormVacancyDatesComponent,
  list: FormListComponent,
  static: FormInputComponent,
  fieldsGroup: FormFieldsGroupComponent,
  formOptions: FormOptionsComponent,
  json: FormJsonComponent
};

@Directive({
  selector: '[formElement]'
})
export class FormElementDirective implements OnInit, OnChanges {
  @Input()
  public config;

  @Input()
  public label = true;

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
      this.component.instance.label = this.label;
      this.component.instance.group = this.group;
      this.component.instance.errors = this.errors;
      this.component.instance.event = this.event;
      this.component.instance.message = this.message;
      this.component.instance.buttonAction = this.buttonAction;
    }
  }

  public ngOnInit() {
    if (this.checkElement(this.config.type)) {
      let component;
      if (this.config.type === 'input') {
        if (this.config.templateOptions.type === 'picture') {
          component = components['picture'];
        } else {
          component = components[this.config.type];
        }
      } else {
        component = components[this.config.type];
      }
      const factory = this.resolver.resolveComponentFactory<any>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.config = this.config;
      this.component.instance.label = this.label;
      this.component.instance.group = this.group;
      this.component.instance.errors = this.errors;
      this.component.instance.event = this.event;
      this.component.instance.message = this.message;
      this.component.instance.buttonAction = this.buttonAction;
    }
  }

  public checkElement(type) {
    if (components[type]) {
      return true;
    }
    return false;
  }
}
