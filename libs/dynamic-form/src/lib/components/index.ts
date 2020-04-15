import { ActionElementComponent } from './action-element/action-element.component';

import { InfoComponent } from './info/info.component';
import { WebcamComponent } from './webcam/webcam.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { TestGeneratorComponent } from './test-generator/test-generator.component';
import { TestListComponent } from './test-list/test-list.component';
import { TimeTrackingComponent } from './time-tracking/time-tracking.component';
import { SignatureComponent } from './signature/signature.component';

// Filters
import {
  FilterChoiceComponent,
  FilterDateComponent,
  FilterLimitComponent,
  FilterMultipleComponent,
  FilterRangeComponent,
  FilterRelatedComponent,
  FilterSelectComponent
} from './filter-elements';

// Form elements
import { GenericFormComponent } from './generic-form/generic-form.component';

import {
  ExtendComponent,
  FormButtonComponent,
  FormCheckboxComponent,
  FormDatepickerComponent,
  FormFieldsGroupComponent,
  FormInputComponent,
  FormJsonComponent,
  FormListComponent,
  FormOptionsComponent,
  FormPictureComponent,
  FormRadioComponent,
  FormRelatedComponent,
  FormReplaceComponent,
  FormRuleComponent,
  FormSelectComponent,
  FormTextareaComponent,
  FormTimelineComponent,
  FormVacancyDatesComponent,
  FormInfoComponent,
  FormEditorComponent,
  FormTrackingComponent,
  FormListDropdownComponent,
  FormElementViewComponent,
  DropdownComponent,
  FormBankAccountComponent
} from './form-elements';

// import { ExtendComponent } from './extend/extend.component';

// List elements
import { GenericListComponent } from './generic-list/generic-list.component';

import {
  ListCheckboxComponent,
  ListImageComponent,
  ListInfoComponent,
  ListLinkComponent,
  ListSkillsComponent,
  ListTableComponent,
  ListTagsComponent,
  ListTextComponent,
  ListFillinTagsComponent,
  ListAvailableComponent,
  ListFormComponent
} from './list-elements';

import { ListSerachBarComponent } from './list-search-bar/list-search-bar.component';
import { SortIconComponent } from './sort-icon/sort-icon.component';

export * from './generic-form/generic-form.component';
export * from './generic-list/generic-list.component';
export * from './action-element/action-element.component';
export * from './webcam/webcam.component';
export * from './workflow/workflow.component';
export * from './test-generator/test-generator.component';

export * from './filter-elements';
export * from './form-elements';

export const entryComponents = [
  FilterChoiceComponent,
  FilterDateComponent,
  FilterLimitComponent,
  FilterMultipleComponent,
  FilterRangeComponent,
  FilterRelatedComponent,
  FilterSelectComponent,

  FormButtonComponent,
  FormCheckboxComponent,
  FormDatepickerComponent,
  FormFieldsGroupComponent,
  FormInputComponent,
  FormJsonComponent,
  FormListComponent,
  FormOptionsComponent,
  FormPictureComponent,
  FormRadioComponent,
  FormRelatedComponent,
  FormRuleComponent,
  FormSelectComponent,
  FormTextareaComponent,
  FormTimelineComponent,
  FormVacancyDatesComponent,
  FormInfoComponent,
  FormReplaceComponent,
  FormEditorComponent,
  FormTrackingComponent,
  FormListDropdownComponent,
  FormBankAccountComponent,

  ListCheckboxComponent,
  ListImageComponent,
  ListInfoComponent,
  ListLinkComponent,
  ListSerachBarComponent,
  ListSkillsComponent,
  ListTableComponent,
  ListTagsComponent,
  ListTextComponent,
  ListFillinTagsComponent,
  ListAvailableComponent,
  ListFormComponent,

  TestGeneratorComponent,
  TestListComponent,
  TimeTrackingComponent,
  ExtendComponent,
  SignatureComponent,

  InfoComponent
];

export const components = [
  GenericFormComponent,
  GenericListComponent,
  ActionElementComponent,
  WebcamComponent,
  WorkflowComponent,
  TestGeneratorComponent,
  FormElementViewComponent,
  DropdownComponent,

  SortIconComponent,

  ...entryComponents
];
