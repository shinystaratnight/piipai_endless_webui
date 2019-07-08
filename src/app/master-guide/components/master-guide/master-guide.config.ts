import { GuideItem } from "../../interfaces";

export const guide: GuideItem[] = [
  {
    completed: false,
    text: [
      'Add Your',
      { url: '/core/companies/{company_id}/change' , text: 'Business address' }
    ],
  },
  {
    completed: true,
    text: ['Add Your industry: multiple choices available']
  },
  {
    completed: false,
    text: ['Master company purpose'],
    options: [
      { active: false, text: 'We will use software to manage our own workers' },
      { active: false, text: 'We use software to manage hire workers for whose work we charge our clients hourly' },
      { active: false, text: 'We use software to find candidates or to sell candidate profiles' },
    ]
  },
  {
    completed: true,
    text: [
      'Add your',
      { url: '/skills/skills/add' , text: 'Skills' },
      'and skill rates'
    ]
  },
  {
    completed: false,
    text: [
      'Who beside you will be working with this software ( add company users',
      { url: '/core/companies/{company_id}/change' , text: 'company users' },
      ')'
    ]
  },
  {
    completed: false,
    text: [
      'Create your first',
      { url: '/candidate/candidatecontacts/add' , text: 'candidate' }
    ]
  },
  {
    completed: false,
    text: [
      'Create your first',
      { url: '/core/companies/add' , text: 'client' }
    ]
  },
  {
    completed: false,
    text: [
      'Create your first',
      { url: '/hr/jobsites/add' , text: 'jobsite' }
    ]
  },
];
