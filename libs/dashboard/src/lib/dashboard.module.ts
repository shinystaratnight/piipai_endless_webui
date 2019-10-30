import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '@webui/shared';
import { CalendarModule } from '@webui/calendar';
import { DynamicFormModule } from '@webui/dynamic-form';

import { DashboardService } from './services';
import {
  ButtonsWidget,
  CandidateWidget,
  CalendarWidgetComponent,
  SettingsButtonComponent
} from './components';
import { WidgetDirective } from './directives';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    SharedModule,
    CalendarModule,
    DynamicFormModule
  ],
  declarations: [
    DashboardComponent,
    ButtonsWidget,
    CandidateWidget,
    CalendarWidgetComponent,
    SettingsButtonComponent,
    WidgetDirective
  ],
  providers: [DashboardService],
  entryComponents: [ButtonsWidget, CandidateWidget, CalendarWidgetComponent],
  exports: [DashboardComponent]
})
export class DashboardModule {
  constructor() {
    library.add(faCog);
  }
}
