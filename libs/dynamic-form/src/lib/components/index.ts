import { ActionElementComponent } from './action-element/action-element.component';

import { InfoComponent } from './info/info.component';
import { WebcamComponent } from './webcam/webcam.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { TestGeneratorComponent } from './test-generator/test-generator.component';
import { TestListComponent } from './test-list/test-list.component';
import { TimeTrackingComponent } from './time-tracking/time-tracking.component';
import { SignatureComponent } from './signature/signature.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { FormErrorsComponent } from './form-errors/form-errors.component';

// Filters
import {
  FilterChoiceComponent,
  FilterDateComponent,
  FilterLimitComponent,
  FilterMultipleComponent,
  FilterRangeComponent,
  FilterRelatedComponent,
  FilterSelectComponent,
  FilterHeaderComponent
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
  FormBankAccountComponent,
  FormImageListComponent,
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
  ListFormComponent,
  ListColumnHeaderComponent,
  ListSkillActivityComponent,
} from './list-elements';

import { ListSerachBarComponent } from './list-search-bar/list-search-bar.component';

export * from './generic-form/generic-form.component';
export * from './generic-list/generic-list.component';
export * from './action-element/action-element.component';
export * from './webcam/webcam.component';
export * from './workflow/workflow.component';
export * from './test-generator/test-generator.component';
export * from './image-uploader/image-uploader.component';

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
  FilterHeaderComponent,

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
  FormImageListComponent,

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
  ListColumnHeaderComponent,
  ListSkillActivityComponent,

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
  ImageUploaderComponent,

  FormErrorsComponent,

  ...entryComponents
];
