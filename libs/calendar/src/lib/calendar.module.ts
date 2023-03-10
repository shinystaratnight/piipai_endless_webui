import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { CalendarComponent } from './components';
import { SelectDateDirective } from './directives';
import { CalendarTooltipDirective } from './pipes';
import {
  CalendarService,
  CalendarDataService,
  SelectDateService,
} from './services';

// import { SharedModule } from '@webui/shared';
import { DynamicFormModule } from '@webui/dynamic-form';
import { SharedModule } from '@webui/shared';
import { UiModule } from '@webui/ui';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgbTooltipModule,
    ButtonsModule,
    // SharedModule,
    DynamicFormModule,
    TranslateModule,
    UiModule,
    SharedModule
  ],
  declarations: [
    CalendarComponent,
    CalendarTooltipDirective,
    SelectDateDirective,
  ],
  exports: [CalendarComponent],
  providers: [CalendarService, CalendarDataService, SelectDateService],
})
export class CalendarModule {}
