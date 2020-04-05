export enum Endpoints {
  // Contact
  Contact = '/core/contacts/',
  ContactUnavailability = '/core/contactunavailabilities/',
  ContactForgotPassword = '/core/contacts/forgot_password/',
  ContactChangePassword = 'change_password',
  ContactPassword = 'password',

  User = '/core/users/',

  // Company
  Company = '/core/companies/',
  CompanyAddress = '/core/companyaddresses/',
  CompanyContactRelationship = '/core/companycontactrelationships/',
  CompanyLocalization = '/core/companylocalizations/',
  CompanyContact = '/core/companycontacts/',
  CompanyRel = '/core/companyrels/',
  CompanyTradeReference = '/core/companytradereferences/',

  // Skill
  Skill = '/skills/skills/',
  SkillName = '/skills/skillnames/',
  SkillTag = '/skills/skilltags/',
  SkillBaseRate = '/skills/skillbaserates/',
  SkillEmploymentClassification = '/skills/employmentclassifications/',
  SkillRateCoefficient = '/candidate/skillratecoefficientrels/',

  // Billing
  BillingCompany = '/billing/companies/',
  BillingDiscount = '/billing/discounts/',

  // Jobsite
  Jobsite = '/hr/jobsites/',
  JobsiteUnavailability = '/hr/jobsiteunavailabilities/',
  JobsiteMap = '/hr/jobsites/jobsite_map/',
  JobsiteClient = '/hr/jobsites/client_contact_jobsite/',

  // Job
  Job = '/hr/jobs/',
  ShiftDate = '/hr/shiftdates/',
  JobOffer = '/hr/joboffers/',
  Shift = '/hr/shifts/',
  JobTag = '/hr/jobtags/',

  // Candidate
  CandidateContact = '/candidate/candidatecontacts/',
  CandidatePool = '/candidate/candidatecontacts/pool/',
  CandidateSuperAnnuationFund = '/candidate/superannuationfunds/',
  CandidateInterviewSchedule = '/candidate/interviewschedules/',
  CandidateVisaType = '/candidate/visatypes/',
  CandidateTag = '/candidate/tagrels/',
  CandidateSkill = '/candidate/skillrels/',
  CandidateRel = '/candidate/candidaterels/',
  CandidateEvaluation = '/hr/candidateevaluations/',
  CandidateJobOffer = '/hr/joboffers/candidate/',
  CandidateLocation = '/candidate/location/',

  BlackList = '/hr/blacklists/',
  FavouriteList = '/hr/favouritelists/',
  CarrierList = '/hr/carrierlists/',

  JobOfferCandidate = '/hr/joboffers-candidate/',

  // SMS
  SmsMessages = '/sms-interface/smsmessages/',
  SmsTemplate = '/sms-interface/smstemplates/',
  SmsLog = '/sms-interface/smslogs/',

  // Location
  Country = '/core/countries/',
  Region = '/core/regions/',
  City = '/core/cities/',
  Address = '/core/addresses/',

  // Workflow
  Workflow = '/core/workflows/',
  WorkflowNode = '/core/workflownodes/',
  WorkflowObject = '/core/workflowobjects/',
  Timeline = '/core/workflownodes/timeline/',

  // Dynamic form
  Form = '/core/forms/',
  FormBuilder = '/core/formbuilders/',
  FormField = '/core/formfields/',
  FormFieldGroup = '/core/formfieldgroups/',
  FormStorage = '/core/formstorages/',

  // Acceptence Test
  AcceptenceTest = '/acceptance-tests/acceptancetests/',
  AcceptenceTestIndustry = '/acceptance-tests/acceptancetestindustries/',
  AcceptenceTestTag = '/acceptance-tests/acceptancetesttags/',
  AcceptenceTestWorkflowNode = '/acceptance-tests/acceptancetestworkflownodes/',
  AcceptenceTestQuestion = '/acceptance-tests/acceptancetestquestions/',
  AcceptenceTestAnswers = '/acceptance-tests/acceptancetestanswers/',
  AcceptenceTestSkill = '/acceptance-tests/acceptancetestskills/',
  AcceptenceTestPassAnswers = '/acceptance-tests/workflowobjectanswers/',

  // Rate coefficient
  RateCoefficient = '/pricing/ratecoefficients/',
  RateCoefficientGroup = '/pricing/ratecoefficientgroups/',
  RateCoefficientModifier = '/pricing/ratecoefficientmodifiers/',
  RateCoefficientRule = '/pricing/dynamiccoefficientrules/',

  WeekDayWorkRule = '/pricing/weekdayworkrules/',
  OverTimeWorkRule = '/pricing/overtimeworkrules/',
  AllowanceWorkRule = '/pricing/allowanceworkrules/',
  TimeOfDayWorkRule = '/pricing/timeofdayworkrules/',

  // Timesheet
  Timesheet = '/hr/timesheets/',
  TimesheetIssue = '/hr/timesheetissues/',
  TimesheetCandidate = '/hr/timesheets-candidate/',
  TimesheetApproved = '/hr/timesheets/approved/',
  TimesheetHistory = '/hr/timesheets/history/',
  TimesheetUnapproved = '/hr/timesheets/unapproved/',

  // Invoice
  Invoice = '/core/invoices/',
  InvoiceRule = '/core/invoicelines/',

  // Payslip
  Payslip = '/hr/payslips/',
  PayslipLine = '/hr/paysliplines/',
  PayslipRule = '/hr/paysliprules/',

  // Authorization
  Login = '/auth/login/',
  LoginByToke = '/login/tokenlogins/',
  TokenRefresh = '/oauth2/token/',

  // Dashboard
  DashboardModule = '/core/dashboardmodules/',
  UserDashboardModule = '/core/userdashboardmodules/',

  // Price list
  PriceList = '/pricing/pricelists/',
  PriceListRate = '/pricing/pricelistrates/',
  PriceListRateCoefficient = '/pricing/pricelistratecoefficients/',
  PriceListRateModifiers = '/pricing/pricelistratemodifiers/',

  Industry = '/pricing/industries/',

  //  Other
  FileStorage = '/core/filestorages/',
  ExtranetNavigation = '/core/extranetnavigations/',
  BankAccount = '/core/bankaccounts/',
  Activity = '/activity/activities/',
  Permission = '/company-settings/globalpermissions/',
  Note = '/core/notes/',
  Order = '/core/orders/',
  Tag = '/core/tags/',
  ManagerCompanySettings = '/company_settings/',
  CompanySettings = '/company_settings/site/',
  Language = '/languages/',
  CandidateLanguages = '/candidate_contacts/',
  CompanyLanguages = '/companies/'
}
