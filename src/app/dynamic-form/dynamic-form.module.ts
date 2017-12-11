import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { WebCamComponent } from 'ng2-webcam';
import { ButtonRadioDirective } from 'ngx-bootstrap';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

import { ProfileComponent } from '../components/profile/profile.component';

import { GenericFormComponent } from './components/generic-form/generic-form.component';
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormElementDirective } from './components/form-element/form-element.directive';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormRowComponent } from './containers/form-row/form-row.component';
import { FormButtonComponent } from './components/form-button/form-button.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormDatepickerComponent } from './components/form-datepicker/form-datepicker.component';
import { FormTextareaComponent } from './components/form-textarea/form-textarea.component';
import { FormCollapseComponent } from './containers/form-collapse/form-collapse.component';
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component';
import { FormRelatedComponent } from './components/form-related/form-related.component';
import { FormRuleComponent } from './components/form-rule/form-rule.component';
import { FormTimelineComponent } from './components/form-timeline/form-timeline.component';
import { FormPictureComponent } from './components/form-picture/form-picture.component';
import { FormHiddenComponent } from './containers/form-hidden/form-hidden.component';
import {
  FormVacancyDatesComponent
} from './components/form-vacancy-dates/form-vacancy-dates.component';
import {
  FormFieldsGroupComponent
} from './components/form-fields-group/form-fields-group.component';
import { FormOptionsComponent } from './components/form-options/form-options.component';
import { FormRadioComponent } from './components/form-radio/form-radio.component';
import { FormReplaceComponent } from './components/form-replace/form-replace.component';
import { FormJsonComponent } from './components/form-json/form-json.component';
import { FormColumnComponent } from './containers/form-column/form-column.component';

import { GenericListComponent } from './components/generic-list/generic-list.component';
import { DynamicListComponent } from './containers/dynamic-list/dynamic-list.component';
import { ListElementDirective } from './components/list-element/list-element.directive';
import { ListTextComponent } from './components/list-text/list-text.component';
import { ListLinkComponent } from './components/list-link/list-link.component';
import { ListColumnComponent } from './containers/list-column/list-column.component';
import { FilterBlockComponent } from './containers/filter-block/filter-block.component';
import { FilterDateComponent } from './components/filter-date/filter-date.component';
import { FilterChoiceComponent } from './components/filter-choice/filter-choice.component';
import { FilterRelatedComponent } from './components/filter-related/filter-related.component';
import { FilterElementDirective } from './components/filter-element/filter-element.directive';
import { FilterService } from './services/filter.service';
import { ListCheckboxComponent } from './components/list-checkbox/list-checkbox.component';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import { ListTableComponent } from './components/list-table/list-table.component';
import { ListImageComponent } from './components/list-image/list-image.copmonent';
import { FormListComponent } from './components/form-list/form-list.component';
import { ListButtonsComponent } from './containers/list-buttons/list-buttons.component';
import { ListSerachBarComponent } from './components/list-search-bar/list-search-bar.component';

import { ActionElementComponent } from './components/action-element/action-element.component';

import { GenericFormService } from './services/generic-form.service';

import { MoveDirective } from './directives/move.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Angular2FontawesomeModule,
    FormsModule,
    RouterModule,
    AgmCoreModule.forRoot(),
    InfiniteScrollModule
  ],
  exports: [GenericFormComponent, GenericListComponent, DynamicFormComponent, ProfileComponent],
  declarations: [
    DynamicFormComponent,
    FormInputComponent,
    FormElementDirective,
    FormRowComponent,
    FormButtonComponent,
    FormSelectComponent,
    FormDatepickerComponent,
    FormTextareaComponent,
    FormCollapseComponent,
    GenericFormComponent,
    FormCheckboxComponent,
    FormRelatedComponent,
    DynamicListComponent,
    ListElementDirective,
    ListTextComponent,
    ListLinkComponent,
    ListColumnComponent,
    FilterBlockComponent,
    FilterDateComponent,
    FilterChoiceComponent,
    FilterRelatedComponent,
    FilterElementDirective,
    ActionElementComponent,
    GenericListComponent,
    ListCheckboxComponent,
    MoveDirective,
    FilterSelectComponent,
    ListTableComponent,
    FormRuleComponent,
    FormTimelineComponent,
    FormPictureComponent,
    WebCamComponent,
    FormHiddenComponent,
    FormVacancyDatesComponent,
    ListImageComponent,
    FormListComponent,
    ListButtonsComponent,
    FormFieldsGroupComponent,
    FormOptionsComponent,
    ListSerachBarComponent,
    ButtonRadioDirective,
    PdfViewerComponent,
    FormRadioComponent,
    FormReplaceComponent,
    FormJsonComponent,
    FormColumnComponent,
    ProfileComponent
  ],
  providers: [GenericFormService, FilterService],
  entryComponents: [
    FormInputComponent,
    FormRowComponent,
    FormButtonComponent,
    FormSelectComponent,
    FormDatepickerComponent,
    FormTextareaComponent,
    FormCollapseComponent,
    FormCheckboxComponent,
    FormRelatedComponent,
    ListTextComponent,
    ListLinkComponent,
    ListColumnComponent,
    FilterDateComponent,
    FilterChoiceComponent,
    FilterRelatedComponent,
    ListCheckboxComponent,
    FilterSelectComponent,
    FormRuleComponent,
    FormTimelineComponent,
    FormPictureComponent,
    FormHiddenComponent,
    FormVacancyDatesComponent,
    ListImageComponent,
    FormListComponent,
    FormFieldsGroupComponent,
    FormOptionsComponent,
    FormRadioComponent,
    FormReplaceComponent,
    FormJsonComponent,
    FormColumnComponent
  ]
})
export class DynamicFormModule { }
