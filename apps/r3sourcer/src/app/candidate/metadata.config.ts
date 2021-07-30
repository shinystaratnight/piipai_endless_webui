import { Endpoints } from '@webui/data';
import {
  metadataJoboffersCandidate,
  metadataTimesheetsCandidate,
  metadataSubmit,
  metadataProfile,
  timesheetratescandidate,
} from '@webui/candidate-metadata';

import {
  tagrels,
  skillrels,
  candidateevaluations,
  passwordchange,
  passwordforgot,
  notes,
} from '@webui/shared-metadata';

export class Metadata {
  [Endpoints.CandidateTag] = tagrels;
  [Endpoints.CandidateSkill] = skillrels;
  [Endpoints.CandidateEvaluation] = candidateevaluations;
  [Endpoints.JobOfferCandidate] = metadataJoboffersCandidate;
  [Endpoints.TimesheetCandidate] = metadataTimesheetsCandidate;
  'submit' = metadataSubmit;
  [Endpoints.CandidateContact] = metadataProfile;
  [Endpoints.ContactChangePassword] = passwordchange;
  [Endpoints.ContactForgotPassword] = passwordforgot;
  [Endpoints.TimesheetRates] = timesheetratescandidate;
  [Endpoints.Note] = notes;
}
