import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';

import {
  CloseButtonComponent,
  TimeComponent,
  BackLinkComponent,
  CheckboxComponent,
  LoaderComponent,
  SpinnerComponent,
  LanguageSelectorComponent,
  UserAvatarComponent
} from './components';
import { IconComponent } from './components/icon/icon.component';

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
    UserAvatarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
    ReactiveFormsModule,
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
