import * as address from './address.metadata';
import * as candidatecontacts from './candidatecontacts.metadata';
import * as candidatepool from './candidatepool.metadata';
import * as contacts from './contacts.metadata';
import * as companies from './companies.metadata';
import * as companycontacts from './companycontacts.metadata';
import * as jobs from './jobs.metadata';
import * as jobsites from './jobsites.metadata';
import * as ratecoefficients from './ratecoefficients.metadata';
import * as industries from './industries.metadata';
import * as pricelists from './pricelists.metadata';
import * as bankaccounts from './bankaccounts.metadata';
import * as timesheets from './timesheets.metadata';
import * as superannuationfunds from './superannuationfunds.metadata';
import * as invoices from './invoices.metadata';
import * as employmentclassifications from './employmentclassifications.metadata';
import * as activities from './activities.metadata';
import * as dashboardmodules from './dashboardmodules.metadata';
import * as userdashboardmodules from './userdashboardmodules.metadata';
import * as cities from './cities.metadata';
import * as countries from './countries.metadata';
import * as regions from './regions.metadata';
import * as filestorages from './filestorages.metadata';
import * as extranetnavigations from './extranetnavigations.metadata';
import * as workflows from './workflows.metadata';
import * as workflownodes from './workflownodes.metadata';
import * as workflowobjects from './workflowobjects.metadata';
import * as forms from './forms.metadata';
import * as formbuilders from './formbuilders.metadata';
import * as formfields from './formfields.metadata';
import * as formfieldgroups from './formfieldgroups.metadata';
import * as formstorages from './formstorages.metadata';
import * as acceptancetestquestions from './acceptancetestquestions.metadata';
import * as acceptancetestanswers from './acceptancetestanswers.metadata';
import * as acceptancetestskills from './acceptancetestskills.metadata';
import * as interviewschedules from './interviewschedules.metadata';
import * as users from './users.metadata';
import * as smsmessages from './smsmessages.metadata';
import * as smstemplates from './smstemplates.metadata';
import * as tags from './tags.metadata';
import * as skills from './skills.metadata';
import * as visatypes from './visatypes.metadata';
import * as blacklists from './blacklists.metadata';
import * as favouritelists from './favouritelists.metadate';
import * as carrierlists from './carrierlists.metadata';
import * as companyaddresses from './companyaddresses.metadata';
import * as companycontactrelationships from './companycontactrelationships.metadata';
import * as companylocalizations from './companylocalizations.metadata';
import * as companyrels from './companyrels.metadata';
import * as companytradereferences from './companytradereferences.metadata';
import * as contactunavailabilities from './contactunavailabilities.metadata';
import * as notes from './notes.metadata';
import * as orders from './orders.metadata';
import * as shiftdates from './shiftdates.metadata';
import * as joboffers from './joboffers.metadata';
import * as jobsiteunavailabilities from './jobsiteunavailabilities.metadata';
import * as tagrels from './tagrels.metadata';
import * as skillrels from './skillrels.metadata';
import * as candidaterels from './candidaterels.metadata';
import * as candidateevaluations from './candidateevaluations.metadata';
import * as timesheetissues from './timesheetissues.metadata';
import * as ratecoefficientgroups from './ratecoefficientgroups.metadata';
import * as ratecoefficientmodifiers from './ratecoefficientmodifiers.metadata';
import * as dynamiccoefficientrules from './dynamiccoefficientrules.metadata';
import * as weekdayworkrules from './weekdayworkrules.metadata';
import * as overtimeworkrules from './overtimeworkrules.metadata';
import * as allowanceworkrules from './allowanceworkrules.metadata';
import * as timeofdayworkrules from './timeofdayworkrules.metadata';
import * as pricelistrates from './pricelistrates.metadata';
import * as pricelistratecoefficients from './pricelistratecoefficients.metadata';
import * as invoicelines from './invoicelines.metadata';
import * as payslips from './payslips.metadata';
import * as paysliplines from './paysliplines.metadata';
import * as paysliprules from './paysliprules.metadata';
import * as login from './login.metadata';
import * as joboffersCandidate from './joboffers-candidate.metadata';
import * as timesheetsCandidate from './timesheets-candidate.metadata';
import * as approved from './approved.metadata';
import * as history from './history.metadata';
import * as unapproved from './unapproved.metadata';
import * as submit from './submit.metadata';
import * as evaluate from './evaluate.metadata';
import * as notAgree from './not_agree.metadata';
import * as globalpermissions from './globalpermissions.metadata';
import * as joboffersCandidateManager from './joboffers.candidate.metadata';
import * as shifts from './shifts.metadata';
import * as jobtags from './jobtags.metadata';
import * as extend from './extend.metadata';
import * as fillin from './fillin.metadata';
import * as jobsiteMap from './jobsite-map.metadata';
import * as supervisorApprove from './supervisorApprove.metadata';
import * as candidateFill from './candidateFill.metadata';
import * as acceptancetests from './acceptancetests.metadata';
import * as acceptancetestindustries from './acceptancetestindustries.metadata';
import * as acceptancetesttags from './acceptancetesttags.metadata';
import * as acceptancetestworkflownodes from './acceptancetestworkflownodes.metadata';
import * as skillbaserates from './skillbaserates.metadata';
import * as skilltags from './skilltags.metadata';
import * as profile from './profile.metadata';
import * as billingcompanies from './billingcompanies.metadata';
import * as billingdoscounts from './billingdiscount.metadata';
import * as tokenlogins from './tokenlogins.metadata';
import * as passwordforgot from './passwordforgot.metadata';
import * as passwordchange from './passwordchange.metadata';
import * as userpassword from './userpassword.metadata';
import * as skillname from './skillname.metadata';
import * as smslogs from './smslogs.metadata';

import { Endpoints } from '../helpers';

export const metadata = {
  [Endpoints.Address]: address.metadata,
  [Endpoints.CandidateContact]: candidatecontacts.metadata,
  [Endpoints.CandidatePool]: candidatepool.metadata,
  [Endpoints.Contact]: contacts.metadata,
  [Endpoints.Company]: companies.metadata,
  [Endpoints.CompanyContact]: companycontacts.metadata,
  [Endpoints.Job]: jobs.metadata,
  [Endpoints.Jobsite]: jobsites.metadata,
  [Endpoints.RateCoefficient]: ratecoefficients.metadata,
  [Endpoints.Industry]: industries.metadata,
  [Endpoints.PriceList]: pricelists.metadata,
  [Endpoints.BankAccount]: bankaccounts.metadata,
  [Endpoints.Timesheet]: timesheets.metadata,
  [Endpoints.CandidateSuperAnnuationFund]: superannuationfunds.metadata,
  [Endpoints.Invoice]: invoices.metadata,
  [Endpoints.SkillEmploymentClassification]: employmentclassifications.metadata,
  [Endpoints.Activity]: activities.metadata,
  [Endpoints.DashboardModule]: dashboardmodules.metadata,
  [Endpoints.UserDashboardModule]: userdashboardmodules.metadata,
  [Endpoints.City]: cities.metadata,
  [Endpoints.Country]: countries.metadata,
  [Endpoints.Region]: regions.metadata,
  [Endpoints.FileStorage]: filestorages.metadata,
  [Endpoints.ExtranetNavigation]: extranetnavigations.metadata,
  [Endpoints.Workflow]: workflows.metadata,
  [Endpoints.WorkflowNode]: workflownodes.metadata,
  [Endpoints.WorkflowObject]: workflowobjects.metadata,
  [Endpoints.Form]: forms.metadata,
  [Endpoints.FormBuilder]: formbuilders.metadata,
  [Endpoints.FormField]: formfields.metadata,
  [Endpoints.FormFieldGroup]: formfieldgroups.metadata,
  [Endpoints.FormStorage]: formstorages.metadata,
  [Endpoints.AcceptenceTestQuestion]: acceptancetestquestions.metadata,
  [Endpoints.AcceptenceTestAnswers]: acceptancetestanswers.metadata,
  [Endpoints.AcceptenceTestSkill]: acceptancetestskills.metadata,
  [Endpoints.CandidateInterviewSchedule]: interviewschedules.metadata,
  [Endpoints.User]: users.metadata,
  [Endpoints.SmsMessages]: smsmessages.metadata,
  [Endpoints.SmsTemplate]: smstemplates.metadata,
  [Endpoints.Tag]: tags.metadata,
  [Endpoints.Skill]: skills.metadata,
  [Endpoints.SkillTag]: skilltags.metadata,
  [Endpoints.CandidateVisaType]: visatypes.metadata,
  [Endpoints.BlackList]: blacklists.metadata,
  [Endpoints.FavouriteList]: favouritelists.metadata,
  [Endpoints.CarrierList]: carrierlists.metadata,
  [Endpoints.CompanyAddress]: companyaddresses.metadata,
  [Endpoints.CompanyContactRelationship]: companycontactrelationships.metadata,
  [Endpoints.CompanyLocalization]: companylocalizations.metadata,
  [Endpoints.CompanyRel]: companyrels.metadata,
  [Endpoints.CompanyTradeReference]: companytradereferences.metadata,
  [Endpoints.ContactUnavailability]: contactunavailabilities.metadata,
  [Endpoints.Note]: notes.metadata,
  [Endpoints.Order]: orders.metadata,
  [Endpoints.ShiftDate]: shiftdates.metadata,
  [Endpoints.JobOffer]: joboffers.metadata,
  [Endpoints.JobsiteUnavailability]: jobsiteunavailabilities.metadata,
  [Endpoints.CandidateTag]: tagrels.metadata,
  [Endpoints.CandidateSkill]: skillrels.metadata,
  [Endpoints.CandidateRel]: candidaterels.metadata,
  [Endpoints.CandidateEvaluation]: candidateevaluations.metadata,
  [Endpoints.TimesheetIssue]: timesheetissues.metadata,
  [Endpoints.RateCoefficientGroup]: ratecoefficientgroups.metadata,
  [Endpoints.RateCoefficientModifier]: ratecoefficientmodifiers.metadata,
  [Endpoints.RateCoefficientRule]: dynamiccoefficientrules.metadata,
  [Endpoints.WeekDayWorkRule]: weekdayworkrules.metadata,
  [Endpoints.OverTimeWorkRule]: overtimeworkrules.metadata,
  [Endpoints.AllowanceWorkRule]: allowanceworkrules.metadata,
  [Endpoints.TimeOfDayWorkRule]: timeofdayworkrules.metadata,
  [Endpoints.PriceListRate]: pricelistrates.metadata,
  [Endpoints.PriceListRateCoefficient]: pricelistratecoefficients.metadata,
  [Endpoints.InvoiceRule]: invoicelines.metadata,
  [Endpoints.Payslip]: payslips.metadata,
  [Endpoints.PayslipLine]: paysliplines.metadata,
  [Endpoints.PayslipRule]: paysliprules.metadata,
  [Endpoints.Login]: login.metadata,
  [Endpoints.JobOfferCandidate]: joboffersCandidate.metadata,
  [Endpoints.TimesheetCandidate]: timesheetsCandidate.metadata,
  [Endpoints.TimesheetApproved]: approved.metadata,
  [Endpoints.TimesheetHistory]: history.metadata,
  [Endpoints.TimesheetUnapproved]: unapproved.metadata,
  'submit': submit.metadata,
  'evaluate': evaluate.metadata,
  'not_agree': notAgree.metadata,
  [Endpoints.Permission]: globalpermissions.metadata,
  [Endpoints.CandidateJobOffer]: joboffersCandidateManager.metadata,
  [Endpoints.Shift]: shifts.metadata,
  [Endpoints.JobTag]: jobtags.metadata,
  'extend': extend.metadata,
  'fillin': fillin.metadata,
  [Endpoints.JobsiteMap]: jobsiteMap.metadata,
  'supervisorApprove': supervisorApprove.metadata,
  'candidateFill': candidateFill.metadata,
  [Endpoints.AcceptenceTest]: acceptancetests.metadata,
  [Endpoints.AcceptenceTestIndustry]: acceptancetestindustries.metadata,
  [Endpoints.AcceptenceTestTag]: acceptancetesttags.metadata,
  [Endpoints.AcceptenceTestWorkflowNode]: acceptancetestworkflownodes.metadata,
  [Endpoints.SkillBaseRate]: skillbaserates.metadata,
  'profile': profile.metadata,
  [Endpoints.BillingCompany]: billingcompanies.metadata,
  [Endpoints.BillingDiscount]: billingdoscounts.metadata,
  [Endpoints.LoginByToke]: tokenlogins.metadata,
  [Endpoints.ContactForgotPassword]: passwordforgot.metadata,
  [Endpoints.ContactChangePassword]: passwordchange.metadata,
  [Endpoints.ContactPassword]: userpassword.metadata,
  [Endpoints.SkillName]: skillname.metadata,
  [Endpoints.SmsLog]: smslogs.metadata,
};
