import { Endpoints } from '@webui/data';
import {
  history,
  unapproved,
  notAgree,
  jobsitesclient,
} from '@webui/client-metadata';

import {
  passwordchange,
  jobs,
  notes,
  address
} from '@webui/shared-metadata';

export class Metadata {
  [Endpoints.TimesheetHistory] = history;
  [Endpoints.TimesheetUnapproved] = unapproved;
  'not_agree' = notAgree;
  [Endpoints.ContactChangePassword] = passwordchange;
  [Endpoints.JobsiteClient] = jobsitesclient;
  [Endpoints.Job] = jobs;
  [Endpoints.Note] = notes;
  [Endpoints.Address] = address;
}
