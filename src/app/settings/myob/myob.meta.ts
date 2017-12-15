export const meta = [
  {
    name: 'API Connection',
    type: 'collapse',
    children: [
      {
        type: 'input',
        key: 'key',
        templateOptions: {
          label: 'Developer Key',
          type: 'text'
        }
      },
      {
        type: 'input',
        key: 'secret',
        templateOptions: {
          label: 'Developer Secret',
          type: 'text'
        }
      },
      {
        type: 'button',
        key: 'connect',
        list: true,
        templateOptions: {
          text: 'Connect',
          p: true,
          action: 'connect'
        }
      }
    ]
  }
];

export const payrollAccounts = {
  isCollapsed: true,
  subcontractor: [
    {
      label: 'Subcontractor',
      value: '',
      key: 'subcontractor',
    },
    {
      label: 'Contract work',
      value: '',
      key: 'subcontractor_contract_work',
    }, {
      label: 'GST',
      value: '',
      key: 'subcontractor_gst',
    }
  ],
  candidate: [
    {
      label: 'Cadidate',
      value: '',
      key: 'candidate',
    },
    {
      label: 'Wages and Salries',
      value: '',
      key: 'candidate_wages',
    },
    {
      label: 'Superannuation',
      value: '',
      key: 'candidate_superannuation',
    }
  ],
  company_client: [
    {
      label: 'Company Client',
      value: '',
      key: 'company_client',
    },
    {
      label: 'Labour hire services',
      value: '',
      key: 'company_client_labour_hire',
    },
    {
      label: 'GST',
      value: '',
      key: 'company_client_gst',
    },
  ]
};
