import { SiteComponent } from './site/site.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FillInComponent } from './fill-in/fill-in.component';
import { VerifyEmailComponent } from './varify-email/varify-email.component';
import { MapComponent } from './map/map.component';
import { TestBuilderComponent } from './test-builder/test-builder.component';
import { MobileTimesheetsComponent } from './mobile-timesheets/mobile-timesheets.component';

import { MapService } from './map/map.service';

export * from './fill-in/fill-in.component';
export * from './form-builder/form-builder.component';
export * from './site/site.component';
export * from './varify-email/varify-email.component';
export * from './map/map.component';
export * from './test-builder/test-builder.component';

export * from './map/map.service';

export const components = [
  SiteComponent,
  FormBuilderComponent,
  FillInComponent,
  VerifyEmailComponent,
  MapComponent,
  TestBuilderComponent,
  MobileTimesheetsComponent
];

export const providers = [MapService];
