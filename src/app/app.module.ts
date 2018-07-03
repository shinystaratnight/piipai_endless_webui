import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, RequestOptions } from '@angular/http';
import {
  NgModule
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { NoContentComponent } from './pages/no-content';
import { components } from './components';
import { services } from './services';
import { guards } from './guards';
import { Ng2Webstorage } from 'ng2-webstorage';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { SharedModule } from './shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import moment from 'moment-timezone';

moment.tz.setDefault('Australia/Sydney');

import '../styles/styles.scss';

import 'jquery-ui';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import '../../node_modules/jtsage-datebox-bootstrap4/jtsage-datebox.js';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  // AppState
];

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    NoContentComponent,
    ...components
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule.forRoot(),
    Ng2Webstorage.forRoot({ prefix: 'web', separator: '.' }),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    DynamicFormModule,
    Angular2FontawesomeModule,
    SharedModule,
    InfiniteScrollModule,
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    ...services,
    ...guards,
    CookieService
  ]
})
export class AppModule {}
