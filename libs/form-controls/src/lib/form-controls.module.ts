import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DropdownContentComponent,
  FormDatepickerControlComponent,
  FormDropdownControlComponent,
  FormInputControlComponent,
  FormRadioSwitchComponent
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
    FormRadioSwitchComponent
  ],
  exports: [
    FormInputControlComponent,
    FormDatepickerControlComponent,
    FormDropdownControlComponent,
    FormRadioSwitchComponent
  ]
})
export class FormControlsModule {}
