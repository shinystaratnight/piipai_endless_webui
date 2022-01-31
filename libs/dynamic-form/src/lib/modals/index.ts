import { BaseModalComponent } from './base-modal/base-modal.component';
import { PassTestModalComponent } from './pass-test-modal/pass-test-modal.component';
import { SelectDatesModalComponent } from './select-dates-modal/select-dates-modal.component';
import { TrackingModalComponent } from './tracking-modal/tracking-modal.component';
import { EvaluateModalComponent } from './evaluate-modal/evaluate-modal.component';
import { ChangeTimesheetModalComponent } from './change-timesheet-modal/change-timesheet-modal.component';
import { EvaluateFieldComponent } from './evaluate-field/evaluate-field.component';
import { ApproveTimesheetModalComponent } from './approve-timesheet-modal/approve-timesheet-modal.component';
import { SubmissionModalComponent } from './submission-modal/submission-modal.component';
import { SignatureModalComponent } from './signature-modal/signature-modal.component';
import { EvaluateCandidateModalComponent } from './evaluate-candidate-modal/evaluate-candidate-modal.component';
import { TimesheetDetailsPreviewComponent } from './timesheet-details-preview/timesheet-details-preview.component';

export * from './base-modal/base-modal.component';
export * from './pass-test-modal/pass-test-modal.component';
export * from './select-dates-modal/select-dates-modal.component';
export * from './tracking-modal/tracking-modal.component';
export * from './evaluate-modal/evaluate-modal.component';
export * from './modal/modal.component';
export * from './change-timesheet-modal/change-timesheet-modal.component';
export * from './approve-timesheet-modal/approve-timesheet-modal.component';
export * from './submission-modal/submission-modal.component';
export * from './signature-modal/signature-modal.component';
export * from './evaluate-candidate-modal/evaluate-candidate-modal.component';
export * from './timesheet-details-preview/timesheet-details-preview.component'

export const modals = [
  BaseModalComponent,
  PassTestModalComponent,
  SelectDatesModalComponent,
  TrackingModalComponent,
  EvaluateModalComponent,
  ChangeTimesheetModalComponent,
  ApproveTimesheetModalComponent,
  SubmissionModalComponent,
  SignatureModalComponent,
  EvaluateCandidateModalComponent,
  TimesheetDetailsPreviewComponent
];

export const components = [EvaluateFieldComponent];
