import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  FontAwesomeModule,
  FaIconLibrary
} from '@fortawesome/angular-fontawesome';
import {
  faEllipsisH,
  faArrowsAlt,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from '@webui/calendar';
import { DynamicFormModule } from '@webui/dynamic-form';
import { UiModule } from '@webui/ui';
import { TranslateModule } from '@ngx-translate/core';

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
    // SharedModule,
    CalendarModule,
    DynamicFormModule,
    NgbTooltipModule,
    FormsModule,
    NgbModalModule,
    DragDropModule,
    ReactiveFormsModule,
    UiModule,
    TranslateModule,
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
  constructor(library: FaIconLibrary) {
    library.addIcons(faEllipsisH, faArrowsAlt, faTrash);
  }
}
