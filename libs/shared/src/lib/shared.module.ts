import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { components } from './components';
import { directives } from './directives';
import { pipes } from './pipes';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {
  HttpLoaderFactory,
  MissingTranslationHelper,
} from '../../../../apps/r3sourcer/src/app/translate.loader';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationHelper,
      },
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [...components, ...pipes, ...directives, TranslateModule],
  declarations: [...components, ...pipes, ...directives],
})
export class SharedModule {}
