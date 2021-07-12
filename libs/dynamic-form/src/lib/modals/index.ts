import { BaseModalComponent } from './base-modal/base-modal.component';
import { PassTestModalComponent } from './pass-test-modal/pass-test-modal.component';
import { SelectDatesModalComponent } from './select-dates-modal/select-dates-modal.component';
import { TrackingModalComponent } from './tracking-modal/tracking-modal.component';
import { EvaluateModalComponent } from './evaluate-modal/evaluate-modal.component';
import { ClientTimesheetModalComponent } from './client-timesheet-modal/client-timesheet-modal.component';
import { ChangeTimesheetModalComponent } from './change-timesheet-modal/change-timesheet-modal.component';
import { EvaluateFieldComponent } from './evaluate-field/evaluate-field.component';

export * from './base-modal/base-modal.component';
export * from './pass-test-modal/pass-test-modal.component';
export * from './select-dates-modal/select-dates-modal.component';
export * from './tracking-modal/tracking-modal.component';
export * from './evaluate-modal/evaluate-modal.component';
export * from './modal/modal.component';
export * from './client-timesheet-modal/client-timesheet-modal.component';
export * from './change-timesheet-modal/change-timesheet-modal.component';

export const modals = [
  BaseModalComponent,
  PassTestModalComponent,
  SelectDatesModalComponent,
  TrackingModalComponent,
  EvaluateModalComponent,
  ClientTimesheetModalComponent,
  ChangeTimesheetModalComponent,
];

export const components = [
  EvaluateFieldComponent,
]
