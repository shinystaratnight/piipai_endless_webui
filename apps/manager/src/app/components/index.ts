import { SiteComponent } from './site/site.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FillInComponent } from './fill-in/fill-in.component';
import { VerifyEmailComponent } from './varify-email/varify-email.component';
import { MapComponent } from './map/map.component';
import { TestBuilderComponent } from './test-builder/test-builder.component';
import { MobileTimesheetsComponent } from './mobile-timesheets/mobile-timesheets.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarTooltipDirective } from './calendar/calendar-tooltip.directive';

import { MapService } from './map/map.service';
import { CalendarService } from './calendar/calendar.service';
import { CalendarDataService } from './calendar/calendar-data.service';

export * from './dashboard/dashboard.component';
export * from './fill-in/fill-in.component';
export * from './form-builder/form-builder.component';
export * from './site/site.component';
export * from './varify-email/varify-email.component';
export * from './map/map.component';
export * from './test-builder/test-builder.component';

export * from './map/map.service';

export const components = [
  SiteComponent,
  DashboardComponent,
  FormBuilderComponent,
  FillInComponent,
  VerifyEmailComponent,
  MapComponent,
  TestBuilderComponent,
  MobileTimesheetsComponent,
  CalendarComponent,
  CalendarTooltipDirective,
];

export const providers = [
  MapService,
  CalendarService,
  CalendarDataService,
];
