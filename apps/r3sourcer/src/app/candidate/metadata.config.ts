import { Endpoints } from '@webui/data';
import {
  metadataJoboffersCandidate,
  metadataTimesheetsCandidate,
  metadataSubmit,
  metadataProfile
} from '@webui/candidate-metadata';

import {
  tagrels,
  skillrels,
  candidateevaluations,
  passwordchange
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
}
