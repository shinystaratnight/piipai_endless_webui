import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, NoPreloading } from '@angular/router';

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
  faExternalLinkAlt,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { VerifyEmailComponent } from './components';

import { routes } from './app.routing';

import { CoreModule } from '@webui/core';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { DynamicFormModule } from '@webui/dynamic-form';
import { Metadata } from './metadata.config';
import { MasterGuideModule } from './master-guide/master-guide.module';

@NgModule({
  declarations: [
    AppComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: NoPreloading }),
    HttpClientModule,
    FontAwesomeModule,
    NgxWebstorageModule.forRoot({ prefix: 'web', separator: '.' }),
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_GEO_CODING_API_KEY,
      libraries: ['places']
    }),

    CoreModule.forRoot(environment),
    DynamicFormModule.forRoot({ metadata: Metadata }),
    MasterGuideModule
  ],
  providers: [],
  bootstrap: [AppComponent]
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
    library.add(faEnvelope);
  }
}
