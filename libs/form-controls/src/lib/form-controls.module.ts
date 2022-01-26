import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DropdownContentComponent,
  FormCheckboxComponent,
  FormDatepickerControlComponent,
  FormDropdownControlComponent,
  FormInputControlComponent,
  FormRadioSwitchComponent,
  FormTextareaComponent
} from './components';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@webui/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UiModule } from '@webui/ui';
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
    IconModule,
    ScrollingModule,
    UiModule,
    PlatformModule,
    TranslateModule
  ],
  declarations: [
    FormInputControlComponent,
    FormDropdownControlComponent,
    FormDatepickerControlComponent,
    DropdownContentComponent,
    FormRadioSwitchComponent,
    FormCheckboxComponent,
    FormTextareaComponent
  ],
  exports: [
    FormInputControlComponent,
    FormDatepickerControlComponent,
    FormDropdownControlComponent,
    FormRadioSwitchComponent,
    FormCheckboxComponent,
    FormTextareaComponent
  ]
})
export class FormControlsModule {}
