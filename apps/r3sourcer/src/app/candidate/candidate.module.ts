import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CandidateComponent } from './candidate.component';

import { components } from './components';
import { routes } from './candidate.routing';

// import { SharedModule } from '@webui/shared';
import { DynamicFormModule } from '@webui/dynamic-form';
import { CalendarModule } from '@webui/calendar';

import { Metadata } from './metadata.config';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CandidateComponent, ...components],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // FontAwesomeModule,
    InfiniteScrollModule,

    // SharedModule,
    DynamicFormModule.forChild({ metadata: Metadata }),
    CalendarModule,
    SharedModule
  ]
})
export class CandidateModule {}
