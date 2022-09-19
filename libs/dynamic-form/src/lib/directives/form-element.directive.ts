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

import {
  ExtendComponent,
  FormInputComponent,
  FormButtonComponent,
  FormSelectComponent,
  FormDatepickerComponent,
  FormTextareaComponent,
  FormCheckboxComponent,
  FormRelatedComponent,
  FormRuleComponent,
  FormTimelineComponent,
  FormPictureComponent,
  FormVacancyDatesComponent,
  FormListComponent,
  FormFieldsGroupComponent,
  FormOptionsComponent,
  FormRadioComponent,
  FormReplaceComponent,
  FormJsonComponent,
  FormInfoComponent,
  FormEditorComponent,
  FormTrackingComponent,
  FormListDropdownComponent,
  FormBankAccountComponent,
  FormImageListComponent,
  FormLegendComponent
} from '../components/form-elements';

import { TestListComponent } from '../components/test-list/test-list.component';
import { FormGroupComponent } from '../containers/form-group/form-group.component';
import { FormColumnComponent } from '../containers/form-column/form-column.component';
import { FormTabsComponent } from '../containers/form-tabs/form-tabs.component';
import { FormHiddenComponent } from '../containers/form-hidden/form-hidden.component';
import { FormCollapseComponent } from '../containers/form-collapse/form-collapse.component';
import { FormRowComponent } from '../containers/form-row/form-row.component';
import { ListLinkComponent } from '../components/list-elements';

const components: Record<string, any> = {
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
  testList: TestListComponent,
  editor: FormEditorComponent,
  tracking: FormTrackingComponent,
  listdropdown: FormListDropdownComponent,
  bank_account: FormBankAccountComponent,
  image_list: FormImageListComponent,
  legend: FormLegendComponent
};

@Directive({
  selector: '[webuiFormElement]'
})
export class FormElementDirective implements OnInit, OnChanges {
  @Input()
  public config!: any;

  @Input()
  public label = true;

  @Input()
  public last!: boolean;

  @Input()
  public group!: FormGroup;

  @Input()
  public errors: any;

  @Input()
  public message: any;

  @Input() public formId!: number;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public component!: ComponentRef<any>;

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
      this.component.instance.last = this.last;
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
      this.component.instance.last = this.last;
    }
  }

  public checkElement(type: string) {
    if (components[type]) {
      return true;
    }
    return false;
  }

  public getComponent(type: string, edit?: boolean) {
    if (type === 'address' && edit) {
      return FormRelatedComponent;
    }
    return components[type];
  }
}
