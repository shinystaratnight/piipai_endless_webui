const mapFilters = [
  {
    key: 'filterby',
    label: 'By Type',
    options: [
      {
        value: 'clients',
        label: 'All Clients'
      },
      {
        value: 'only_hq',
        label: 'Only Client HQs'
      },
      {
        value: 'jobsites',
        label: 'All Jobsites'
      }
    ],
    query: 'filterby',
    default: null,
    type: 'select'
  },
  {
    key: 'jobsite',
    label: 'Jobsite',
    type: 'related',
    data: {
      value: '__str__',
      endpoint: '/ecore/api/v2/hr/jobsites/',
      key: 'id'
    },
    query: 'jobsite'
  },
  {
    key: 'client',
    label: 'Client',
    type: 'related',
    data: {
      value: '__str__',
      endpoint: '/ecore/api/v2/core/companies/',
      key: 'id'
    },
    query: 'client'
  },
  {
    key: 'portfolio_manager',
    label: 'Portfolio Manager',
    type: 'related',
    data: {
      value: '__str__',
      endpoint: '/ecore/api/v2/core/companycontacts/',
      key: 'id'
    },
    query: 'portfolio_manager'
  },
];

export const metadata = {
  mapFilters
};
