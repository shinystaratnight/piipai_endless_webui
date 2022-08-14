import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// import { AgmCoreModule } from '@agm/core';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
// import { NgxWebstorageModule } from 'ngx-webstorage';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { routes } from './manager.routing';

import { ManagerComponent } from './manager.component';
// import { RedirectComponent } from './redirect.component';

import * as formComponents from './components';
// import { services } from './services';
// import { guards } from './guards';
// import { interceptors } from './interceptors';

import { DynamicFormModule } from '@webui/dynamic-form';
import { CalendarModule } from '@webui/calendar';

// import { SharedModule } from '@webui/shared';
// import { CoreModule } from '@webui/core';
import { DashboardModule } from '@webui/dashboard';

import { Metadata } from './metadata.config';

// const newMetadata = Object.create(metadata);

// import { environment } from '../../environments/environment';

import { MasterGuideModule } from '../master-guide/master-guide.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SharedModule as LibSharedModule } from '@webui/shared';
import { UiModule } from '@webui/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogModule } from '@webui/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  // bootstrap: [ ManagerComponent ],
  declarations: [
    ManagerComponent,
    // RedirectComponent,
    ...formComponents.components,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    // AgmCoreModule,
    // AgmCoreModule.forRoot({
    //   apiKey: environment.GOOGLE_GEO_CODING_API_KEY,
    //   libraries: ['places']
    // }),
    // NgbModule,
    ButtonsModule.forRoot(),
    // NgxWebstorageModule.forRoot({ prefix: 'web', separator: '.' }),
    RouterModule.forChild(routes),
    DynamicFormModule.forChild({ metadata: Metadata }),
    // SharedModule,
    InfiniteScrollModule,
    MasterGuideModule,
    NgbNavModule,

    FontAwesomeModule,
    // CoreModule.forRoot(environment),
    CalendarModule,
    DashboardModule,
    SharedModule,
    LibSharedModule,
    UiModule,
    DragDropModule,
    DialogModule,
    TranslateModule,
  ],
  providers: [
    // ...guards,
    ...formComponents.providers,
    // ...interceptors
  ],
})
export class ManagerModule {}
