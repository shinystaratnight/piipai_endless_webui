import * as moment from 'moment-timezone';

const today = moment().tz('Australia/Sydney');

export const todayFormatDate = today.format();
export const yesterdayFormatDate = today
  .clone()
  .add(-1, 'day')
  .format();
export const tomorrowFormatDate = today
  .clone()
  .add(1, 'day')
  .format();
export const timeZoneOffset = moment
  .tz('Australia/Sydney')
  .format('Z')
  .slice(1);
export const weekStart = today
  .startOf('isoWeek')
  .format();
export const weekEnd = today
  .endOf('isoWeek')
  .format();
export const monthStart = today
  .startOf('month')
  .format();
export const monthEnd = today
  .endOf('month')
  .format();

export enum Colors {
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger'
}

export enum Endpoints {
  Company = '/core/companies/',
  CompanyContact = '/core/companycontacts/',
  Skills = '/skills/skills',
  Jobsite = '/hr/jobsites/',
  CandidateContact = '/candidate/candidatecontacts/',
  SmsMessages = '/sms-interface/smsmessages/',
  JobOffers = '/hr/joboffers/',
}
