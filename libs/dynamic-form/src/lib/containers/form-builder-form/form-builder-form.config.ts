import { Field } from '@webui/data';

export type FormStep = {
  title: string;
  metadata: Field[];
  content: Array<string | string[]>;
};

export const industryField: Field = {
  type: 'related',
  send: false,
  endpoint: '/pricing/industries/',
  key: 'industry',
  templateOptions: {
    label: 'Industry',
    type: 'related',
    values: ['__str__', 'id', 'translations']
  },
  query: {
    company: '{session.company}'
  }
};

export const steps: FormStep[] = [
  {
    title: 'contact_information',
    metadata: [],
    content: [
      'contact.picture',
      'contact.first_name',
      'contact.last_name',
      'contact.title',
      'contact.gender',
      'contact.birthday',
      'contact.email',
<<<<<<< HEAD
      'contact.phone_mobile',
      
=======
      'contact.phone_mobile'
>>>>>>> 1f449937bb4762477434fbe77fe178e0afe65bfe
    ]
  },
  {
    title: 'additional_information',
    metadata: [],
    content: [
      'contact.address.street_address',
      "contact.address.city",
      "contact.address.state",
      "contact.address.postal_code",
      "contact.address.country",
      'nationality',
      'residency',
      'tax_file_number',
      'transportation_to_work',
      ['weight', 'height']
    ]
  },
  {
    title: 'bank_and_superannuation_informatioin',
    metadata: [],
    content: [
      'contact.bank_accounts.bank_account_number',
      'contact.bank_accounts.bank_account_name',
      'contact.bank_accounts.bsb_number',
      'contact.bank_accounts.AccountholdersName',
      'contact.bank_accounts.bank_name',
      'contact.bank_accounts.IBAN',
      'contact.bank_accounts.TestBankAccountField',
      'formalities.tax_number',
      'formalities.personal_id',
      'superannuation_fund',
      'superannuation_membership_number'
    ]
  },
  {
    title: 'industry_and_skills',
    metadata: [],
    content: ['industry', 'skill', 'tag']
  }
];
