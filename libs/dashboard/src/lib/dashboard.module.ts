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
import { UiModule } from '@webui/ui';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@webui/shared';

import { DashboardService, WidgetService } from './services';
import {
  ButtonsWidgetComponent,
  CandidateWidgetComponent,
  CalendarWidgetComponent,
  DashboardMenuComponent,
  CounterWidgetComponent,
  RangeButtonComponent,
  DashboardWidgetComponent,
  RangeFieldComponent
} from './components';
import { WidgetDirective } from './directives';
import { DashboardComponent } from './dashboard.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { DynamicFormModule } from '@webui/dynamic-form';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    SharedModule,
    CalendarModule,
    NgbTooltipModule,
    FormsModule,
    NgbModalModule,
    DragDropModule,
    ReactiveFormsModule,
    UiModule,
    ButtonsModule,
    TranslateModule,
    BsDatepickerModule,
    DynamicFormModule
  ],
  declarations: [
    DashboardComponent,
    ButtonsWidgetComponent,
    CandidateWidgetComponent,
    CalendarWidgetComponent,
    WidgetDirective,
    DashboardMenuComponent,
    RangeButtonComponent,
    DashboardWidgetComponent,
    CounterWidgetComponent,
    RangeFieldComponent
  ],
  providers: [DashboardService, WidgetService],
  entryComponents: [ButtonsWidgetComponent, CandidateWidgetComponent, CalendarWidgetComponent],
  exports: [DashboardComponent, CounterWidgetComponent]
})
export class DashboardModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faEllipsisH, faArrowsAlt, faTrash);
  }
}
