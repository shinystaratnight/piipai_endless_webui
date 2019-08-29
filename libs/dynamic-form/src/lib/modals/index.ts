import { BaseModalComponent } from './base-modal/base-modal.component';
import { PassTestModalComponent } from './pass-test-modal/pass-test-modal.component';
import { SelectDatesModalComponent } from './select-dates-modal/select-dates-modal.component';
import { TrackingModalComponent } from './tracking-modal/tracking-modal.component';

export * from './base-modal/base-modal.component';
export * from './pass-test-modal/pass-test-modal.component';
export * from './select-dates-modal/select-dates-modal.component';
export * from './tracking-modal/tracking-modal.component';

export const modals = [
  BaseModalComponent,
  PassTestModalComponent,
  SelectDatesModalComponent,
  TrackingModalComponent,
];
