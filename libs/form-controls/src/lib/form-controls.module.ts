import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DropdownContentComponent,
  FormCheckboxComponent,
  FormDatepickerControlComponent,
  FormDropdownControlComponent,
  FormInputControlComponent,
  FormRadioSwitchComponent,
  FormTextareaComponent,
  FormImageUploadControlComponent
} from './components';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@webui/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UiModule } from '@webui/ui';
import { PlatformModule } from '@angular/cdk/platform';
import { NgxDropzoneModule } from 'ngx-dropzone';

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
    TranslateModule,
    NgxDropzoneModule
  ],
  declarations: [
    FormInputControlComponent,
    FormDropdownControlComponent,
    FormDatepickerControlComponent,
    DropdownContentComponent,
    FormRadioSwitchComponent,
    FormCheckboxComponent,
    FormTextareaComponent,
    FormImageUploadControlComponent
  ],
  exports: [
    FormInputControlComponent,
    FormDatepickerControlComponent,
    FormDropdownControlComponent,
    FormRadioSwitchComponent,
    FormCheckboxComponent,
    FormTextareaComponent,
    FormImageUploadControlComponent
  ]
})
export class FormControlsModule {}
