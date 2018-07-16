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
    endpoint: '/ecore/api/v2/core/tags/',
    read_only: true,
    templateOptions: {
      label: 'Tag',
      values: ['__str__'],
      type: 'related'
    },
    type: 'related',
    key: 'tag'
  }
];

export const metadata = {
  formadd
};
