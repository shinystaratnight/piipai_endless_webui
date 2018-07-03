import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { WebCamComponent } from 'ng2-webcam';
import { ButtonRadioDirective } from 'ngx-bootstrap';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { GooglePlaceModule } from 'ng2-google-place-autocomplete';

import { environment } from '../environment';

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
    AgmCoreModule.forRoot({
      apiKey: (<any> process.env).GOOGLE_GEO_CODING_API_KEY || environment.GOOGLE_GEO_CODING_API_KEY
    }),
    InfiniteScrollModule,
    GooglePlaceModule,
    SharedModule,
  ],
  exports: [
    fromComponents.GenericFormComponent,
    fromComponents.GenericListComponent,
    fromContainers.DynamicFormComponent,
    fromComponents.ProfileComponent],
  declarations: [
    WebCamComponent,
    PdfViewerComponent,
    ButtonRadioDirective,

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
