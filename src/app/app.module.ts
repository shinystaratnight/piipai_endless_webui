import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { RedirectComponent } from './redirect.component';

import * as formComponents from './components';
import { services } from './services';
import { guards } from './guards';
import { interceptors } from './interceptors';

import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { SharedModule } from './shared/shared.module';

import { environment } from '../environments/environment';

import * as moment from 'moment-timezone';
import { MasterGuideodule } from './master-guide/master-guide.module';

moment.tz.setDefault('Australia/Sydney');

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    RedirectComponent,
    ...formComponents.components
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_GEO_CODING_API_KEY,
      libraries: ['places']
    }),
    NgbModule.forRoot(),
    ButtonsModule.forRoot(),
    Ng2Webstorage.forRoot({ prefix: 'web', separator: '.' }),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    DynamicFormModule,
    Angular2FontawesomeModule,
    SharedModule,
    InfiniteScrollModule,
    MasterGuideodule,
  ],
  providers: [
    ...services,
    ...guards,
    ...formComponents.providers,
    ...interceptors
  ]
})
export class AppModule {}
