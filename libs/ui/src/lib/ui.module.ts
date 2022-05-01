import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@webui/dialog';

import {
  CloseButtonComponent,
  TimeComponent,
  BackLinkComponent,
  CheckboxComponent,
  LoaderComponent,
  SpinnerComponent,
  LanguageSelectorComponent,
  UserAvatarComponent,
  ConfirmDeleteModalComponent,
  IconComponent,
} from './components';

@NgModule({
  declarations: [
    CloseButtonComponent,
    TimeComponent,
    BackLinkComponent,
    CheckboxComponent,
    LoaderComponent,
    SpinnerComponent,
    LanguageSelectorComponent,
    IconComponent,
    UserAvatarComponent,
    ConfirmDeleteModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  exports: [
    CloseButtonComponent,
    TimeComponent,
    BackLinkComponent,
    CheckboxComponent,
    LoaderComponent,
    SpinnerComponent,
    LanguageSelectorComponent,
    IconComponent,
    UserAvatarComponent,
  ]
})
export class UiModule {}
