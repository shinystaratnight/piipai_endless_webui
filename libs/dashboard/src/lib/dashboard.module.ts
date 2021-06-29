import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
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
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardService, WidgetService } from './services';
import {
  ButtonsWidget,
  CandidateWidget,
  CalendarWidgetComponent,
  DashboardMenuComponent,
  CounterWidgetComponent,
  RangeButtonComponent,
  DashboardWidgetComponent,
  RangeFieldComponent,
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
    ButtonsModule,
    TranslateModule,
    BsDatepickerModule,
  ],
  declarations: [
    DashboardComponent,
    ButtonsWidget,
    CandidateWidget,
    CalendarWidgetComponent,
    WidgetDirective,
    DashboardMenuComponent,
    CounterWidgetComponent,
    RangeButtonComponent,
    DashboardWidgetComponent,
    RangeFieldComponent,
  ],
  providers: [DashboardService, WidgetService],
  entryComponents: [ButtonsWidget, CandidateWidget, CalendarWidgetComponent],
  exports: [DashboardComponent, CounterWidgetComponent]
})
export class DashboardModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faEllipsisH, faArrowsAlt, faTrash);
  }
}
