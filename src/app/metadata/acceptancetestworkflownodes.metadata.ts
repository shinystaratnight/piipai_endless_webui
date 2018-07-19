const formadd = [
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
      values: ['__str__', 'company_workflow_node'],
    },
    type: 'related',
    key: 'company_workflow_node',
  }
];

const form = [
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
      values: ['__str__', 'company_workflow_node'],
    },
    type: 'related',
    key: 'company_workflow_node',
  }
];

export const metadata = {
  form,
  formadd
};
