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
  isCollapsed: false,
  subcontractor: [
    {
      label: 'Subcontractor',
      key: 'subcontractor',
    },
    {
      label: 'Contract work',
      key: 'subcontractor_contract_work',
    }, {
      label: 'GST',
      key: 'subcontractor_gst',
    }
  ],
  candidate: [
    {
      label: 'Cadidate',
      key: 'candidate',
    },
    {
      label: 'Wages and Salries',
      key: 'candidate_wages',
    },
    {
      label: 'Superannuation',
      key: 'candidate_superannuation',
    }
  ],
  company_client: [
    {
      label: 'Company Client',
      key: 'company_client',
    },
    {
      label: 'Labour hire services',
      key: 'company_client_labour_hire',
    },
    {
      label: 'GST',
      key: 'company_client_gst',
    },
  ]
};
