import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AgmCoreModule } from '@agm/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ButtonsModule } from 'ngx-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DndModule } from 'ng2-dnd';
import { QuillModule } from 'ngx-quill';
import { SignaturePadModule } from 'angular2-signaturepad';

import { SharedModule } from '../shared/shared.module';

import { services } from './services';

import * as fromComponents from './components';

import * as fromContainers from './containers';

import { modals } from './modals';

import { directives } from './directives';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    Angular2FontawesomeModule,
    FormsModule,
    RouterModule,
    AgmCoreModule,
    InfiniteScrollModule,
    SharedModule,
    ButtonsModule.forRoot(),
    GooglePlaceModule,
    DndModule.forRoot(),
    PdfViewerModule,
    QuillModule,
    SignaturePadModule,
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
    fromComponents.FilterRelatedComponent
  ],
  declarations: [
    fromComponents.WebcamComponent,

    ...fromComponents.components,
    ...directives,
    ...fromContainers.components,
    ...modals
  ],
  providers: [
    ...services,
  ],
  entryComponents: [
    ...fromComponents.entryComponents,
    ...fromContainers.entryComponents,
    ...modals
  ]
})
export class DynamicFormModule { }
