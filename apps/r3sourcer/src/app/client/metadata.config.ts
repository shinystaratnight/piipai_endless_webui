import { Endpoints } from '@webui/data';
import {
  history,
  unapproved,
  notAgree,
  jobsitesclient,
  extend,
  fillin,
  clientjobs
} from '@webui/client-metadata';

import {
  passwordchange,
  notes,
  address,
  passwordforgot
} from '@webui/shared-metadata';

export class Metadata {
  [Endpoints.TimesheetHistory] = history;
  [Endpoints.TimesheetUnapproved] = unapproved;
  'not_agree' = notAgree;
  [Endpoints.ContactChangePassword] = passwordchange;
  [Endpoints.ContactForgotPassword] = passwordforgot;
  [Endpoints.JobsiteClient] = jobsitesclient;
  [Endpoints.Job] = clientjobs;
  [Endpoints.Note] = notes;
  [Endpoints.Address] = address;
  'extend' = extend;
  'fillin' = fillin;
}
