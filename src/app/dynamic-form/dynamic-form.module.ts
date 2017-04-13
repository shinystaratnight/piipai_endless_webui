import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormElementDirective } from './components/form-element/form-element.directive';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormRowComponent } from './containers/form-row/form-row.component';
import { FormButtonComponent } from './components/form-button/form-button.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormDatepickerComponent } from './components/form-datepicker/form-datepicker.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  exports: [DynamicFormComponent],
  declarations: [
    DynamicFormComponent,
    FormInputComponent,
    FormElementDirective,
    FormRowComponent,
    FormButtonComponent,
    FormSelectComponent,
    FormDatepickerComponent
  ],
  providers: [],
  entryComponents: [
    FormInputComponent,
    FormRowComponent,
    FormButtonComponent,
    FormSelectComponent,
    FormDatepickerComponent
  ]
})
export class DynamicFormModule { }
