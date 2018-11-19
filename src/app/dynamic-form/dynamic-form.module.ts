import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AgmCoreModule } from '@agm/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ButtonsModule } from 'ngx-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DndModule } from 'ng2-dnd';

import { SharedModule } from '../shared/shared.module';

import { services } from './services';

import * as fromComponents from './components';

import * as fromContainers from './containers';

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
    HttpClientModule
  ],
  exports: [
    fromComponents.GenericFormComponent,
    fromComponents.GenericListComponent,
    fromContainers.DynamicFormComponent,
    fromContainers.DynamicListComponent,
    fromComponents.ProfileComponent,
    fromContainers.FilterBlockComponent,
    fromComponents.WorkflowComponent,
    fromComponents.TestGeneratorComponent,
    fromContainers.FormBuilderFormComponent,
  ],
  declarations: [
    // PdfViewerComponent,
    fromComponents.WebcamComponent,

    ...fromComponents.components,
    ...directives,
    ...fromContainers.components
  ],
  providers: [
    ...services,
  ],
  entryComponents: [
    ...fromComponents.entryComponents,
    ...fromContainers.entryComponents
  ]
})
export class DynamicFormModule { }
