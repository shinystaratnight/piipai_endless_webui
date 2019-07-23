import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronLeft,
  faChevronRight,
  faCircle,
  faPlus,
  faCheck,
  faMinusCircle,
  faTimes,
  faMinus,
  faList,
  faTimesCircle,
  faStar,
  faPencilAlt,
  faTrash,
  faCheckCircle,
  faEyeSlash,
  faUpload,
  faCamera,
  faEllipsisV,
  faSignInAlt,
  faChevronDown,
  faChevronUp,
  faEye,
  faSearch,
  faCreditCard,
  faMinusSquare,
  faPlusSquare,
  faFile,
  faMapMarkerAlt,
  faDownload,
  faPrint,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

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
import { MasterGuideModule } from './master-guide/master-guide.module';

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
    NgbModule,
    ButtonsModule.forRoot(),
    NgxWebstorageModule.forRoot({ prefix: 'web', separator: '.' }),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules }),
    DynamicFormModule,
    SharedModule,
    InfiniteScrollModule,
    MasterGuideModule,

    FontAwesomeModule,
  ],
  providers: [
    ...services,
    ...guards,
    ...formComponents.providers,
    ...interceptors
  ]
})
export class AppModule {
  constructor() {
    library.add(faChevronLeft);
    library.add(faChevronRight);
    library.add(faPlus);
    library.add(faCircle);
    library.add(faCheck);
    library.add(faMinusCircle);
    library.add(faTimes);
    library.add(faMinus);
    library.add(faList);
    library.add(faTimesCircle);
    library.add(faStar);
    library.add(faMapMarkerAlt);
    library.add(faPencilAlt);
    library.add(faTrash);
    library.add(faCheckCircle);
    library.add(faEyeSlash);
    library.add(faUpload);
    library.add(faCamera);
    library.add(faEllipsisV);
    library.add(faSignInAlt);
    library.add(faChevronDown);
    library.add(faChevronUp);
    library.add(faEye);
    library.add(faSearch);
    library.add(faCreditCard);
    library.add(faMinusSquare);
    library.add(faPlusSquare);
    library.add(faFile);
    library.add(faDownload);
    library.add(faPrint);
    library.add(faExternalLinkAlt);
  }
}
