import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { SignaturePadModule } from 'angular2-signaturepad';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

// import { SharedModule } from '@webui/shared';
import { MetadataModule } from '@webui/metadata';

import { services, METADATA } from './services';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { modals } from './modals';
import { directives } from './directives';

import {
  TranslateModule,
  TranslateLoader,
  TranslateCompiler,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { MissingTranslationHelper } from '../../../../apps/r3sourcer/src/app/translate.loader';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule,
    AgmCoreModule,
    InfiniteScrollModule,
    // SharedModule,
    ButtonsModule.forRoot(),
    GooglePlaceModule,
    QuillModule,
    SignaturePadModule,
    DragDropModule,

    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,

    MetadataModule,

    // TranslateModule.forChild({
    //   missingTranslationHandler: {
    //     provide: MissingTranslationHandler,
    //     useClass: MissingTranslationHelper,
    //   },
    // }),
    TranslateModule.forChild({
      extend: true,
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationHelper,
      },
    }),
  ],
  exports: [
    fromComponents.GenericFormComponent,
    fromComponents.GenericListComponent,
    fromContainers.DynamicFormComponent,
    fromContainers.DynamicListComponent,
    fromContainers.FilterBlockComponent,
    fromComponents.WorkflowComponent,
    fromComponents.TestGeneratorComponent,
    fromContainers.FormBuilderFormComponent,
    fromComponents.FilterRelatedComponent,
  ],
  declarations: [
    fromComponents.WebcamComponent,

    ...fromComponents.components,
    ...directives,
    ...fromContainers.components,
    ...modals,
  ],
  providers: [...services],
  entryComponents: [
    ...fromComponents.entryComponents,
    ...fromContainers.entryComponents,
    ...modals,
  ],
})
export class DynamicFormModule {
  static forRoot(data: {
    metadata: any;
  }): ModuleWithProviders<DynamicFormModule> {
    return {
      ngModule: DynamicFormModule,
      providers: [{ provide: METADATA, useClass: data.metadata }],
    };
  }

  static forChild(data: {
    metadata: any;
  }): ModuleWithProviders<DynamicFormModule> {
    return {
      ngModule: DynamicFormModule,
      providers: [{ provide: METADATA, useClass: data.metadata }],
    };
  }
}
