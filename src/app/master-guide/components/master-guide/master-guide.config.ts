import { GuideItem } from "../../interfaces";

import { Endpoints } from '../../../metadata/helpers';

export const guide: GuideItem[] = [
  {
    key: 'has_company_address',
    text: [
      'Add Your',
      { url: `${Endpoints.Company}{company_id}/change` , text: 'Business address' }
    ],
  },
  {
    key: 'has_industry',
    text: ['Add Your industry: multiple choices available']
  },
  {
    key: 'purpose',
    text: ['Master company purpose'],
    endpoint: `${Endpoints.Company}{company_id}/`,
    options: [
      { value: 'self_use', active: false, text: 'We will use software to manage our own workers' },
      { value: 'hire', active: false, text: 'We use software to manage hire workers for whose work we charge our clients hourly' },
      { value: 'recruitment', active: false, text: 'We use software to find candidates or to sell candidate profiles' },
    ]
  },
  {
    key: 'has_skills',
    text: [
      'Add your',
      { url: `${Endpoints.Skill}add` , text: 'Skills' },
      'and skill rates'
    ]
  },
  {
    key: 'has_company_contact',
    text: [
      'Who beside you will be working with this software ( add company users',
      { url: `${Endpoints.Company}{company_id}/change` , text: 'company users' },
      ')'
    ]
  },
  {
    key: 'has_candidate',
    text: [
      'Create your first',
      { url: `${Endpoints.Skill}add` , text: 'candidate' }
    ]
  },
  {
    key: 'has_client',
    text: [
      'Create your first',
      { url: `${Endpoints.Company}add` , text: 'client' }
    ]
  },
  {
    key: 'has_jobsite',
    text: [
      'Create your first',
      { url: `${Endpoints.Jobsite}add` , text: 'jobsite' }
    ]
  },
  {
    key: 'myob_connected',
    text: [
      'Integrations(MYOB only), take to Settings connect',
      { url: `/settings/myob` , text: 'MYOB' }
    ]
  },
];
