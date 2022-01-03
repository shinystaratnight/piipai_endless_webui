import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DropdownContentComponent,
  FormDatepickerControlComponent,
  FormDropdownControlComponent,
  FormInputControlComponent
} from './components';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@webui/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UiModule } from "@webui/ui";

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
    UiModule
  ],
  declarations: [
    FormInputControlComponent,
    FormDropdownControlComponent,
    FormDatepickerControlComponent,
    DropdownContentComponent
  ],
  exports: [FormInputControlComponent, FormDatepickerControlComponent, FormDropdownControlComponent]
})
export class FormControlsModule {}
