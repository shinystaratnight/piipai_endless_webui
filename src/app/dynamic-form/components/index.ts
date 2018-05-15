import { ActionElementComponent } from './action-element/action-element.component';

import { ProfileComponent } from './profile/profile.component';

// Filters
import { FilterChoiceComponent } from './filter-choice/filter-choice.component';
import { FilterDateComponent } from './filter-date/filter-date.component';
import { FilterLimitComponent } from './filter-limit/filter-limit.component';
import { FilterMultipleComponent } from './filter-multiple/filter-multiple.component';
import { FilterRangeComponent } from './filter-range/filter-range.component';
import { FilterRelatedComponent } from './filter-related/filter-related.component';
import { FilterSelectComponent } from './filter-select/filter-select.component';

// Form elements
import { GenericFormComponent } from './generic-form/generic-form.component';

import { FormButtonComponent } from './form-button/form-button.component';
import { FormCheckboxComponent } from './form-checkbox/form-checkbox.component';
import { FormDatepickerComponent } from './form-datepicker/form-datepicker.component';
import { FormFieldsGroupComponent } from './form-fields-group/form-fields-group.component';
import { FormInputComponent } from './form-input/form-input.component';
import { FormJsonComponent } from './form-json/form-json.component';
import { FormListComponent } from './form-list/form-list.component';
import { FormOptionsComponent } from './form-options/form-options.component';
import { FormPictureComponent } from './form-picture/form-picture.component';
import { FormRadioComponent } from './form-radio/form-radio.component';
import { FormRelatedComponent } from './form-related/form-related.component';
import { FormReplaceComponent } from './form-replace/form-replace.component';
import { FormRuleComponent } from './form-rule/form-rule.component';
import { FormSelectComponent } from './form-select/form-select.component';
import { FormTextareaComponent } from './form-textarea/form-textarea.component';
import { FormTimelineComponent } from './form-timeline/form-timeline.component';
import { FormVacancyDatesComponent } from './form-vacancy-dates/form-vacancy-dates.component';

// List elements
import { GenericListComponent } from './generic-list/generic-list.component';

import { ListCheckboxComponent } from './list-checkbox/list-checkbox.component';
import { ListImageComponent } from './list-image/list-image.copmonent';
import { ListInfoComponent } from './list-info/list-info.component';
import { ListLinkComponent } from './list-link/list-link.component';
import { ListSerachBarComponent } from './list-search-bar/list-search-bar.component';
import { ListSkillsComponent } from './list-skills/list-skills.component';
import { ListTableComponent } from './list-table/list-table.component';
import { ListTagsComponent } from './list-tags/list-tags.component';
import { ListTextComponent } from './list-text/list-text.component';

export * from './generic-form/generic-form.component';
export * from './generic-list/generic-list.component';
export * from './action-element/action-element.component';
export * from './basic-element/basic-element.component';
export * from './profile/profile.component';

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
  FormReplaceComponent,
  FormRuleComponent,
  FormSelectComponent,
  FormTextareaComponent,
  FormTimelineComponent,
  FormVacancyDatesComponent,

  ListCheckboxComponent,
  ListImageComponent,
  ListInfoComponent,
  ListLinkComponent,
  ListSerachBarComponent,
  ListSkillsComponent,
  ListTableComponent,
  ListTagsComponent,
  ListTextComponent,
];

export const components = [
  GenericFormComponent,
  GenericListComponent,
  ActionElementComponent,
  ProfileComponent,

  ...entryComponents,
];
