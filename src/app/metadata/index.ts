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

export const metadata = {
  '/ecore/api/v2/core/addresses/': address.metadata,
  '/ecore/api/v2/candidate/candidatecontacts/': candidatecontacts.metadata,
  '/ecore/api/v2/core/contacts/': contacts.metadata,
  '/ecore/api/v2/core/companies/': companies.metadata,
  '/ecore/api/v2/core/companycontacts/': companycontacts.metadata,
  '/ecore/api/v2/hr/jobs/': jobs.metadata,
  '/ecore/api/v2/hr/jobsites/': jobsites.metadata,
  '/ecore/api/v2/pricing/ratecoefficients/': ratecoefficients.metadata,
  '/ecore/api/v2/pricing/industries/': industries.metadata,
  '/ecore/api/v2/pricing/pricelists/': pricelists.metadata,
  '/ecore/api/v2/core/bankaccounts/': bankaccounts.metadata,
  '/ecore/api/v2/hr/timesheets/': timesheets.metadata,
  '/ecore/api/v2/candidate/superannuationfunds/': superannuationfunds.metadata,
  '/ecore/api/v2/core/invoices/': invoices.metadata,
  '/ecore/api/v2/skills/employmentclassifications/':
    employmentclassifications.metadata,
  '/ecore/api/v2/activity/activities/': activities.metadata,
  '/ecore/api/v2/core/dashboardmodules/': dashboardmodules.metadata,
  '/ecore/api/v2/core/userdashboardmodules/': userdashboardmodules.metadata,
  '/ecore/api/v2/core/cities/': cities.metadata,
  '/ecore/api/v2/core/countries/': countries.metadata,
  '/ecore/api/v2/core/regions/': regions.metadata,
  '/ecore/api/v2/core/filestorages/': filestorages.metadata,
  '/ecore/api/v2/core/extranetnavigations/': extranetnavigations.metadata,
  '/ecore/api/v2/core/workflows/': workflows.metadata,
  '/ecore/api/v2/core/workflownodes/': workflownodes.metadata,
  '/ecore/api/v2/core/workflowobjects/': workflowobjects.metadata,
  '/ecore/api/v2/core/forms/': forms.metadata,
  '/ecore/api/v2/core/formbuilders/': formbuilders.metadata,
  '/ecore/api/v2/core/formfields/': formfields.metadata,
  '/ecore/api/v2/core/formfieldgroups/': formfieldgroups.metadata,
  '/ecore/api/v2/core/formstorages/': formstorages.metadata,
  '/ecore/api/v2/acceptance-tests/acceptancetestquestions/':
    acceptancetestquestions.metadata,
  '/ecore/api/v2/acceptance-tests/acceptancetestanswers/':
    acceptancetestanswers.metadata,
  '/ecore/api/v2/acceptance-tests/acceptancetestskills/':
    acceptancetestskills.metadata,
  '/ecore/api/v2/candidate/interviewschedules/': interviewschedules.metadata,
  '/ecore/api/v2/core/users/': users.metadata,
  '/ecore/api/v2/sms-interface/smsmessages/': smsmessages.metadata,
  '/ecore/api/v2/sms-interface/smstemplates/': smstemplates.metadata,
  '/ecore/api/v2/core/tags/': tags.metadata,
  '/ecore/api/v2/skills/skills/': skills.metadata,
  '/ecore/api/v2/skills/skilltags/': skilltags.metadata,
  '/ecore/api/v2/candidate/visatypes/': visatypes.metadata,
  '/ecore/api/v2/hr/blacklists/': blacklists.metadata,
  '/ecore/api/v2/hr/favouritelists/': favouritelists.metadata,
  '/ecore/api/v2/hr/carrierlists/': carrierlists.metadata,
  '/ecore/api/v2/core/companyaddresses/': companyaddresses.metadata,
  '/ecore/api/v2/core/companycontactrelationships/':
    companycontactrelationships.metadata,
  '/ecore/api/v2/core/companylocalizations/': companylocalizations.metadata,
  '/ecore/api/v2/core/companyrels/': companyrels.metadata,
  '/ecore/api/v2/core/companytradereferences/': companytradereferences.metadata,
  '/ecore/api/v2/core/contactunavailabilities/':
    contactunavailabilities.metadata,
  '/ecore/api/v2/core/notes/': notes.metadata,
  '/ecore/api/v2/core/orders/': orders.metadata,
  '/ecore/api/v2/hr/shiftdates/': shiftdates.metadata,
  '/ecore/api/v2/hr/joboffers/': joboffers.metadata,
  '/ecore/api/v2/hr/jobsiteunavailabilities/': jobsiteunavailabilities.metadata,
  '/ecore/api/v2/candidate/tagrels/': tagrels.metadata,
  '/ecore/api/v2/candidate/skillrels/': skillrels.metadata,
  '/ecore/api/v2/candidate/candidaterels/': candidaterels.metadata,
  '/ecore/api/v2/hr/candidateevaluations/': candidateevaluations.metadata,
  '/ecore/api/v2/hr/timesheetissues/': timesheetissues.metadata,
  '/ecore/api/v2/pricing/ratecoefficientgroups/':
    ratecoefficientgroups.metadata,
  '/ecore/api/v2/pricing/ratecoefficientmodifiers/':
    ratecoefficientmodifiers.metadata,
  '/ecore/api/v2/pricing/dynamiccoefficientrules/':
    dynamiccoefficientrules.metadata,
  '/ecore/api/v2/pricing/weekdayworkrules/': weekdayworkrules.metadata,
  '/ecore/api/v2/pricing/overtimeworkrules/': overtimeworkrules.metadata,
  '/ecore/api/v2/pricing/allowanceworkrules/': allowanceworkrules.metadata,
  '/ecore/api/v2/pricing/timeofdayworkrules/': timeofdayworkrules.metadata,
  '/ecore/api/v2/pricing/pricelistrates/': pricelistrates.metadata,
  '/ecore/api/v2/pricing/pricelistratecoefficients/':
    pricelistratecoefficients.metadata,
  '/ecore/api/v2/core/invoicelines/': invoicelines.metadata,
  '/ecore/api/v2/hr/payslips/': payslips.metadata,
  '/ecore/api/v2/hr/paysliplines/': paysliplines.metadata,
  '/ecore/api/v2/hr/paysliprules/': paysliprules.metadata,
  '/ecore/api/v2/auth/login/': login.metadata,
  '/ecore/api/v2/hr/joboffers-candidate/': joboffersCandidate.metadata,
  '/ecore/api/v2/hr/timesheets-candidate/': timesheetsCandidate.metadata,
  '/ecore/api/v2/hr/timesheets/approved/': approved.metadata,
  '/ecore/api/v2/hr/timesheets/history/': history.metadata,
  '/ecore/api/v2/hr/timesheets/unapproved/': unapproved.metadata,
  'submit': submit.metadata,
  'evaluate': evaluate.metadata,
  'not_agree': notAgree.metadata,
  '/ecore/api/v2/company-settings/globalpermissions/':
    globalpermissions.metadata,
  '/ecore/api/v2/hr/joboffers/candidate/': joboffersCandidateManager.metadata,
  '/ecore/api/v2/hr/shifts/': shifts.metadata,
  '/ecore/api/v2/hr/jobtags/': jobtags.metadata,
  'extend': extend.metadata,
  'fillin': fillin.metadata,
  '/ecore/api/v2/hr/jobsites/jobsite_map/': jobsiteMap.metadata,
  'supervisorApprove': supervisorApprove.metadata,
  'candidateFill': candidateFill.metadata,
  '/ecore/api/v2/acceptance-tests/acceptancetests/': acceptancetests.metadata,
  '/ecore/api/v2/acceptance-tests/acceptancetestindustries/':
    acceptancetestindustries.metadata,
  '/ecore/api/v2/acceptance-tests/acceptancetesttags/':
    acceptancetesttags.metadata,
  '/ecore/api/v2/acceptance-tests/acceptancetestworkflownodes/':
    acceptancetestworkflownodes.metadata,
  '/ecore/api/v2/skills/skillbaserates/': skillbaserates.metadata,
  'profile': profile.metadata,
  '/ecore/api/v2/billing/companies/': billingcompanies.metadata,
  '/ecore/api/v2/billing/discounts/': billingdoscounts.metadata,
  '/ecore/api/v2/login/tokenlogins/': tokenlogins.metadata,
  '/ecore/api/v2/core/contacts/forgot_password/': passwordforgot.metadata,
  'change_password': passwordchange.metadata,
  'password': userpassword.metadata,
  '/ecore/api/v2/skills/skillnames/': skillname.metadata
};
