import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { ClientComponent } from './client.component';
import { components } from './components';

import { routes } from './client.routing';

// import { SharedModule } from '@webui/shared';
import { DynamicFormModule } from '@webui/dynamic-form';
import { CalendarModule } from '@webui/calendar';

import { Metadata } from './metadata.config';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UiModule } from '@webui/ui';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ClientComponent,

    ...components
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    FontAwesomeModule,
    InfiniteScrollModule,
    NgbTabsetModule,

    // SharedModule,
    DynamicFormModule.forChild({ metadata: Metadata }),
    CalendarModule,
    SharedModule,
    UiModule,
    TranslateModule
  ],
})
export class ClientModule {}
