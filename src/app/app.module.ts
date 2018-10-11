import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule
} from '@angular/core';

import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { NoContentComponent } from './pages/no-content';
import { RedirectComponent } from './redirect.component';
import * as formComponents from './components';
import { services } from './services';
import { guards } from './guards';
import { Ng2Webstorage } from 'ngx-webstorage';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { CookieModule } from 'ngx-cookie';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AgmCoreModule } from '@agm/core';

import { SharedModule } from './shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import moment from 'moment-timezone';

import { environment } from './environment';

moment.tz.setDefault('Australia/Sydney');

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    NoContentComponent,
    RedirectComponent,
    ...formComponents.components
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CookieModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_GEO_CODING_API_KEY,
      libraries: ['places']
    }),
    NgbModule.forRoot(),
    Ng2Webstorage.forRoot({ prefix: 'web', separator: '.' }),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    DynamicFormModule,
    Angular2FontawesomeModule,
    SharedModule,
    InfiniteScrollModule,
  ],
  providers: [
    ...services,
    ...guards,
    ...formComponents.providers
  ]
})
export class AppModule {}
