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
  '/ecore/api/v2/skills/employmentclassifications/': employmentclassifications.metadata,
  '/ecore/api/v2/activity/activities/': activities.metadata,
  '/ecore/api/v2/core/dashboardmodules/': dashboardmodules.metadata
};
