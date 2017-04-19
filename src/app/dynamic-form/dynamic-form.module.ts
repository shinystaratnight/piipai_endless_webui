import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

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

import { GenericFormService } from './services/generic-form.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Angular2FontawesomeModule,
    FormsModule
  ],
  exports: [GenericFormComponent],
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
    FormCheckboxComponent
  ],
  providers: [GenericFormService],
  entryComponents: [
    FormInputComponent,
    FormRowComponent,
    FormButtonComponent,
    FormSelectComponent,
    FormDatepickerComponent,
    FormTextareaComponent,
    FormCollapseComponent,
    FormCheckboxComponent
  ]
})
export class DynamicFormModule { }
