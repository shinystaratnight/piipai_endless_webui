import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MissingTranslationHandler,
  TranslateModule
} from '@ngx-translate/core';

import { DynamicFormModule } from '@webui/dynamic-form';

import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';

import { routes } from './login.routes';

import { MissingTranslationHelper } from '../helpers/translate.helper';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationHelper
      },
      extend: true
    }),

    DynamicFormModule,
    SharedModule
  ]
})
export class LoginModule {}
