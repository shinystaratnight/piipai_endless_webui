const form = [
  {
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetests/',
    read_only: true,
    templateOptions: {
      label: 'Acceptance test',
      values: ['__str__'],
      type: 'related'
    },
    type: 'related',
    key: 'acceptance_test'
  },
  {
    endpoint: '/ecore/api/v2/pricing/industries/',
    read_only: true,
    templateOptions: {
      label: 'Tag',
      values: ['__str__'],
      type: 'related'
    },
    type: 'related',
    key: 'industry'
  }
];

const formadd = [
  {
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetests/',
    read_only: true,
    templateOptions: {
      label: 'Acceptance test',
      values: ['__str__'],
      type: 'related'
    },
    type: 'related',
    key: 'acceptance_test'
  },
  {
    endpoint: '/ecore/api/v2/pricing/industries/',
    read_only: true,
    templateOptions: {
      label: 'Tag',
      values: ['__str__'],
      type: 'related'
    },
    type: 'related',
    key: 'industry'
  }
];

export const metadata = {
  form,
  formadd
};
