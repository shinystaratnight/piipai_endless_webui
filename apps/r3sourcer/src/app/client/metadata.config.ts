import { Endpoints } from '@webui/data';
import {
  history,
  unapproved,
  evaluate,
  notAgree,
  jobsitesclient,
} from '@webui/client-metadata';

import {
  passwordchange
} from '@webui/shared-metadata';

export class Metadata {
  [Endpoints.TimesheetHistory] = history;
  [Endpoints.TimesheetUnapproved] = unapproved;
  'evaluate' = evaluate;
  'not_agree' = notAgree;
  [Endpoints.ContactChangePassword] = passwordchange;
  [Endpoints.JobsiteClient] = jobsitesclient;}
