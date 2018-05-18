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

import { environment } from '../environment';

import { SharedModule } from '../shared/shared.module';

import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormRowComponent } from './containers/form-row/form-row.component';
import { FormCollapseComponent } from './containers/form-collapse/form-collapse.component';
import { FormHiddenComponent } from './containers/form-hidden/form-hidden.component';
import { FormColumnComponent } from './containers/form-column/form-column.component';
import { DynamicListComponent } from './containers/dynamic-list/dynamic-list.component';
import { ListColumnComponent } from './containers/list-column/list-column.component';
import { FilterBlockComponent } from './containers/filter-block/filter-block.component';
import { ListButtonsComponent } from './containers/list-buttons/list-buttons.component';

import { services } from './services';

import {
  components,
  entryComponents,

  GenericFormComponent,
  GenericListComponent,
  ProfileComponent,
} from './components';

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
      apiKey: process.env.GOOGLE_GEO_CODING_API_KEY || environment.GOOGLE_GEO_CODING_API_KEY
    }),
    InfiniteScrollModule,
    SharedModule,
  ],
  exports: [GenericFormComponent, GenericListComponent, DynamicFormComponent, ProfileComponent],
  declarations: [
    WebCamComponent,
    PdfViewerComponent,
    ButtonRadioDirective,

    DynamicFormComponent,
    DynamicListComponent,

    FormRowComponent,
    FormCollapseComponent,
    ListColumnComponent,
    FilterBlockComponent,
    FormHiddenComponent,
    ListButtonsComponent,
    FormColumnComponent,

    ...components,
    ...directives,
  ],
  providers: [
    ...services,
  ],
  entryComponents: [
    FormRowComponent,
    FormCollapseComponent,
    ListColumnComponent,
    FormColumnComponent,
    FormHiddenComponent,

    ...entryComponents,
  ]
})
export class DynamicFormModule { }
