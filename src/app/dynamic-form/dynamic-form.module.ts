import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { RouterModule } from '@angular/router';

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
    RouterModule
  ],
  exports: [GenericFormComponent, GenericListComponent],
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
    MoveDirective
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
    ListCheckboxComponent
  ]
})
export class DynamicFormModule { }
