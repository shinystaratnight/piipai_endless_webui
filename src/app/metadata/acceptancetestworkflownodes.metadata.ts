const formadd = [
  {
    endpoint: '/ecore/api/v2/core/companies/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Acceptance test',
      values: ['__str__'],
    },
    type: 'related',
    default: 'currentCompany',
    key: 'company',
  },
  {
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetests/',
    read_only: true,
    templateOptions: {
      label: 'Acceptance test',
      values: ['__str__'],
    },
    type: 'related',
    key: 'acceptance_test',
  },
  {
    endpoint: '/ecore/api/v2/core/companyworkflownodes/',
    read_only: true,
    templateOptions: {
      label: 'Workflow Node',
      values: ['__str__'],
    },
    query: {
      company: '{company.id}'
    },
    type: 'related',
    key: 'company_workflow_node',
  }
];

const form = [
  {
    endpoint: '/ecore/api/v2/core/companies/',
    read_only: true,
    send: false,
    hide: true,
    templateOptions: {
      label: 'Acceptance test',
      values: ['__str__'],
    },
    type: 'related',
    default: 'currentCompany',
    key: 'company',
  },
  {
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetests/',
    read_only: true,
    templateOptions: {
      label: 'Acceptance test',
      values: ['__str__'],
    },
    type: 'related',
    key: 'acceptance_test',
  },
  {
    endpoint: '/ecore/api/v2/core/companyworkflownodes/',
    read_only: true,
    templateOptions: {
      label: 'Workflow Node',
      values: ['__str__'],
    },
    query: {
      company: '{company.id}'
    },
    type: 'related',
    key: 'company_workflow_node',
  }
];

export const metadata = {
  form,
  formadd
};
