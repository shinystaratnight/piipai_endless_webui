import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormElementDirective } from './components/form-element/form-element.directive';
import { FormInputComponent } from './components/form-input/form-input.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [DynamicFormComponent],
  declarations: [
    DynamicFormComponent,
    FormInputComponent
  ],
  providers: [],
  entryComponents: [
    FormInputComponent
  ]
})
export class DynamicFormModule { }
