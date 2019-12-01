import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEllipsisH,
  faArrowsAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@webui/shared';
import { CalendarModule } from '@webui/calendar';
import { DynamicFormModule } from '@webui/dynamic-form';

import { DashboardService, WidgetService } from './services';
import {
  ButtonsWidget,
  CandidateWidget,
  CalendarWidgetComponent,
  DashboardMenuComponent
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
    DynamicFormModule,
    NgbTooltipModule,
    FormsModule,
    NgbModalModule,
    DragDropModule,
    ReactiveFormsModule
  ],
  declarations: [
    DashboardComponent,
    ButtonsWidget,
    CandidateWidget,
    CalendarWidgetComponent,
    WidgetDirective,
    DashboardMenuComponent
  ],
  providers: [DashboardService, WidgetService],
  entryComponents: [ButtonsWidget, CandidateWidget, CalendarWidgetComponent],
  exports: [DashboardComponent]
})
export class DashboardModule {
  constructor() {
    library.add(faEllipsisH, faArrowsAlt, faTrash);
  }
}
