import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, NoPreloading } from '@angular/router';

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
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
  faEnvelope,
  faPlusCircle,
  faRedo,
  faExclamationCircle,
  faSort,
  faSortUp,
  faSortDown,
  faDotCircle,
} from '@fortawesome/free-solid-svg-icons';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
  MissingTranslationHandler,
} from '@ngx-translate/core';

import { VerifyEmailComponent, ToastComponent } from './components';

import { routes } from './app.routing';

import { CoreModule } from '@webui/core';
import { environment } from '../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { DynamicFormModule } from '@webui/dynamic-form';

import { Metadata } from './metadata.config';
import { MasterGuideModule } from './master-guide/master-guide.module';
import { RedirectComponent } from './redirect.component';
import {
  HttpLoaderFactory,
  MissingTranslationHelper,
} from './translate.loader';

@NgModule({
  declarations: [
    AppComponent,
    VerifyEmailComponent,
    RedirectComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: NoPreloading,
    }),
    HttpClientModule,
    FontAwesomeModule,
    NgxWebstorageModule.forRoot({ prefix: 'web', separator: '.' }),
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_GEO_CODING_API_KEY,
      libraries: ['places'],
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationHelper,
      },
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    CoreModule.forRoot(environment),
    DynamicFormModule.forRoot({ metadata: Metadata }),
    MasterGuideModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary, translate: TranslateService) {
    const icons = [
      faChevronLeft,
      faChevronRight,
      faPlus,
      faCircle,
      faCheck,
      faMinusCircle,
      faTimes,
      faMinus,
      faList,
      faTimesCircle,
      faStar,
      faMapMarkerAlt,
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
      faDownload,
      faPrint,
      faExternalLinkAlt,
      faEnvelope,
      faPlusCircle,
      faRedo,
      faExclamationCircle,
      faSort,
      faSortUp,
      faSortDown,
      faDotCircle,
    ];

    console.log(this);

    library.addIcons(...icons);
  }
}
