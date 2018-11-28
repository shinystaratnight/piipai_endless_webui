import * as address from './address.metadata';
import * as candidatecontacts from './candidatecontacts.metadata';
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

export const metadata = {
  '/core/addresses/': address.metadata,
  '/candidate/candidatecontacts/': candidatecontacts.metadata,
  '/core/contacts/': contacts.metadata,
  '/core/companies/': companies.metadata,
  '/core/companycontacts/': companycontacts.metadata,
  '/hr/jobs/': jobs.metadata,
  '/hr/jobsites/': jobsites.metadata,
  '/pricing/ratecoefficients/': ratecoefficients.metadata,
  '/pricing/industries/': industries.metadata,
  '/pricing/pricelists/': pricelists.metadata,
  '/core/bankaccounts/': bankaccounts.metadata,
  '/hr/timesheets/': timesheets.metadata,
  '/candidate/superannuationfunds/': superannuationfunds.metadata,
  '/core/invoices/': invoices.metadata,
  '/skills/employmentclassifications/':
    employmentclassifications.metadata,
  '/activity/activities/': activities.metadata,
  '/core/dashboardmodules/': dashboardmodules.metadata,
  '/core/userdashboardmodules/': userdashboardmodules.metadata,
  '/core/cities/': cities.metadata,
  '/core/countries/': countries.metadata,
  '/core/regions/': regions.metadata,
  '/core/filestorages/': filestorages.metadata,
  '/core/extranetnavigations/': extranetnavigations.metadata,
  '/core/workflows/': workflows.metadata,
  '/core/workflownodes/': workflownodes.metadata,
  '/core/workflowobjects/': workflowobjects.metadata,
  '/core/forms/': forms.metadata,
  '/core/formbuilders/': formbuilders.metadata,
  '/core/formfields/': formfields.metadata,
  '/core/formfieldgroups/': formfieldgroups.metadata,
  '/core/formstorages/': formstorages.metadata,
  '/acceptance-tests/acceptancetestquestions/':
    acceptancetestquestions.metadata,
  '/acceptance-tests/acceptancetestanswers/':
    acceptancetestanswers.metadata,
  '/acceptance-tests/acceptancetestskills/':
    acceptancetestskills.metadata,
  '/candidate/interviewschedules/': interviewschedules.metadata,
  '/core/users/': users.metadata,
  '/sms-interface/smsmessages/': smsmessages.metadata,
  '/sms-interface/smstemplates/': smstemplates.metadata,
  '/core/tags/': tags.metadata,
  '/skills/skills/': skills.metadata,
  '/skills/skilltags/': skilltags.metadata,
  '/candidate/visatypes/': visatypes.metadata,
  '/hr/blacklists/': blacklists.metadata,
  '/hr/favouritelists/': favouritelists.metadata,
  '/hr/carrierlists/': carrierlists.metadata,
  '/core/companyaddresses/': companyaddresses.metadata,
  '/core/companycontactrelationships/':
    companycontactrelationships.metadata,
  '/core/companylocalizations/': companylocalizations.metadata,
  '/core/companyrels/': companyrels.metadata,
  '/core/companytradereferences/': companytradereferences.metadata,
  '/core/contactunavailabilities/':
    contactunavailabilities.metadata,
  '/core/notes/': notes.metadata,
  '/core/orders/': orders.metadata,
  '/hr/shiftdates/': shiftdates.metadata,
  '/hr/joboffers/': joboffers.metadata,
  '/hr/jobsiteunavailabilities/': jobsiteunavailabilities.metadata,
  '/candidate/tagrels/': tagrels.metadata,
  '/candidate/skillrels/': skillrels.metadata,
  '/candidate/candidaterels/': candidaterels.metadata,
  '/hr/candidateevaluations/': candidateevaluations.metadata,
  '/hr/timesheetissues/': timesheetissues.metadata,
  '/pricing/ratecoefficientgroups/':
    ratecoefficientgroups.metadata,
  '/pricing/ratecoefficientmodifiers/':
    ratecoefficientmodifiers.metadata,
  '/pricing/dynamiccoefficientrules/':
    dynamiccoefficientrules.metadata,
  '/pricing/weekdayworkrules/': weekdayworkrules.metadata,
  '/pricing/overtimeworkrules/': overtimeworkrules.metadata,
  '/pricing/allowanceworkrules/': allowanceworkrules.metadata,
  '/pricing/timeofdayworkrules/': timeofdayworkrules.metadata,
  '/pricing/pricelistrates/': pricelistrates.metadata,
  '/pricing/pricelistratecoefficients/':
    pricelistratecoefficients.metadata,
  '/core/invoicelines/': invoicelines.metadata,
  '/hr/payslips/': payslips.metadata,
  '/hr/paysliplines/': paysliplines.metadata,
  '/hr/paysliprules/': paysliprules.metadata,
  '/oauth2/token/': login.metadata,
  '/hr/joboffers-candidate/': joboffersCandidate.metadata,
  '/hr/timesheets-candidate/': timesheetsCandidate.metadata,
  '/hr/timesheets/approved/': approved.metadata,
  '/hr/timesheets/history/': history.metadata,
  '/hr/timesheets/unapproved/': unapproved.metadata,
  'submit': submit.metadata,
  'evaluate': evaluate.metadata,
  'not_agree': notAgree.metadata,
  '/company-settings/globalpermissions/':
    globalpermissions.metadata,
  '/hr/joboffers/candidate/': joboffersCandidateManager.metadata,
  '/hr/shifts/': shifts.metadata,
  '/hr/jobtags/': jobtags.metadata,
  'extend': extend.metadata,
  'fillin': fillin.metadata,
  '/hr/jobsites/jobsite_map/': jobsiteMap.metadata,
  'supervisorApprove': supervisorApprove.metadata,
  'candidateFill': candidateFill.metadata,
  '/acceptance-tests/acceptancetests/': acceptancetests.metadata,
  '/acceptance-tests/acceptancetestindustries/':
    acceptancetestindustries.metadata,
  '/acceptance-tests/acceptancetesttags/':
    acceptancetesttags.metadata,
  '/acceptance-tests/acceptancetestworkflownodes/':
    acceptancetestworkflownodes.metadata,
  '/skills/skillbaserates/': skillbaserates.metadata,
  'profile': profile.metadata,
  '/billing/companies/': billingcompanies.metadata,
  '/billing/discounts/': billingdoscounts.metadata,
  '/login/tokenlogins/': tokenlogins.metadata,
  '/core/contacts/forgot_password/': passwordforgot.metadata,
  'change_password': passwordchange.metadata,
  'password': userpassword.metadata,
  '/skills/skillnames/': skillname.metadata,
  '/sms-interface/smslogs/': smslogs.metadata,
};
