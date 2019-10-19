import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap';

import {
  CalendarComponent,
  DateRangeComponent,
  DatepickerComponent
} from './components';
import { SelectDateDirective } from './directives';
import { CalendarTooltipDirective } from './pipes';
import {
  CalendarService,
  CalendarDataService,
  DatepickerService,
  DateRangeService,
  SelectDateService
} from './services';

import { SharedModule } from '@webui/shared';
import { DynamicFormModule } from '@webui/dynamic-form';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgbTooltipModule,
    ButtonsModule,
    SharedModule,
    DynamicFormModule
  ],
  declarations: [
    CalendarComponent,
    DateRangeComponent,
    CalendarTooltipDirective,
    DatepickerComponent,
    SelectDateDirective
  ],
  exports: [CalendarComponent],
  providers: [
    CalendarService,
    CalendarDataService,
    DatepickerService,
    DateRangeService,
    SelectDateService
  ]
})
export class CalendarModule {}
