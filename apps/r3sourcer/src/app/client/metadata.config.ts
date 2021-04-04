import { Endpoints } from '@webui/data';
import {
  history,
  unapproved,
  notAgree,
  jobsitesclient,
  extend,
  fillin,
  jobs as clientJobs,
  shifts,
  joboffers,
  timesheetratesclient,
} from '@webui/client-metadata';

import {
  passwordchange,
  notes,
  address,
  passwordforgot,
  jobs,
  worktypes,
} from '@webui/shared-metadata';

export class Metadata {
  [Endpoints.TimesheetHistory] = history;
  [Endpoints.TimesheetUnapproved] = unapproved;
  'not_agree' = notAgree;
  [Endpoints.ContactChangePassword] = passwordchange;
  [Endpoints.ContactForgotPassword] = passwordforgot;
  [Endpoints.JobsiteClient] = jobsitesclient;
  [Endpoints.ClientJobs] = clientJobs;
  [Endpoints.Job] = jobs;
  [Endpoints.Note] = notes;
  [Endpoints.Address] = address;
  'extend' = extend;
  'fillin' = fillin;
  [Endpoints.Shift] = shifts;
  [Endpoints.JobOffer] = joboffers;
  [Endpoints.TimesheetRates] = timesheetratesclient;
  [Endpoints.SkillWorkTypes] = worktypes;
}
