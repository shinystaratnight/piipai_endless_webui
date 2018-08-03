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

import { FormInputComponent } from '../components/form-input/form-input.component';
import { FormRowComponent } from '../containers/form-row/form-row.component';
import { FormButtonComponent } from '../components/form-button/form-button.component';
import { FormSelectComponent } from '../components/form-select/form-select.component';
import { FormDatepickerComponent } from '../components/form-datepicker/form-datepicker.component';
import { FormTextareaComponent } from '../components/form-textarea/form-textarea.component';
import { FormCollapseComponent } from '../containers/form-collapse/form-collapse.component';
import { FormCheckboxComponent } from '../components/form-checkbox/form-checkbox.component';
import { FormRelatedComponent } from '../components/form-related/form-related.component';
import { FormRuleComponent } from '../components/form-rule/form-rule.component';
import { FormTimelineComponent } from '../components/form-timeline/form-timeline.component';
import { FormPictureComponent } from '../components/form-picture/form-picture.component';
import { FormHiddenComponent } from '../containers/form-hidden/form-hidden.component';
import { FormVacancyDatesComponent } from '../components/form-vacancy-dates/form-vacancy-dates.component'; //tslint:disable-line
import { FormListComponent } from '../components/form-list/form-list.component';
import { FormFieldsGroupComponent } from '../components/form-fields-group/form-fields-group.component'; //tslint:disable-line
import { FormOptionsComponent } from '../components/form-options/form-options.component';
import { FormRadioComponent } from '../components/form-radio/form-radio.component';
import { FormReplaceComponent } from '../components/form-replace/form-replace.component';
import { ListLinkComponent } from '../components/list-link/list-link.component';
import { FormJsonComponent } from '../components/form-json/form-json.component';
import { FormColumnComponent } from '../containers/form-column/form-column.component';
import { FormTabsComponent } from '../containers/form-tabs/form-tabs.component';
import { FormInfoComponent } from '../components/form-info/form-info.component';
import { FormGroupComponent } from '../containers/form-group/form-group.component';
import { ExtendComponent } from '../components/extend/extend.component';

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
  jobdates: FormVacancyDatesComponent,
  list: FormListComponent,
  static: FormInputComponent,
  fieldsGroup: FormFieldsGroupComponent,
  formOptions: FormOptionsComponent,
  radio: FormRadioComponent,
  replace: FormReplaceComponent,
  link: ListLinkComponent,
  json: FormJsonComponent,
  column: FormColumnComponent,
  tabs: FormTabsComponent,
  info: FormInfoComponent,
  group: FormGroupComponent,
  address: FormInputComponent,
  extend: ExtendComponent,
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

  @Input() public formId: number;

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
      this.component.instance.formId = this.formId;
    }
  }

  public ngOnInit() {
    if (this.checkElement(this.config.type)) {
      let component;
      if (this.config.type === 'input') {
        if (this.config.templateOptions.type === 'picture') {
          component = components['picture'];
        } else {
          component = this.getComponent(this.config.type, this.config.editForm);
        }
      } else {
        component = this.getComponent(this.config.type, this.config.editForm);
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
      this.component.instance.formId = this.formId;
    }
  }

  public checkElement(type) {
    if (components[type]) {
      return true;
    }
    return false;
  }

  public getComponent(type, edit?) {
    if (type === 'address' && edit) {
      return FormRelatedComponent;
    }
    return components[type];
  }
}
