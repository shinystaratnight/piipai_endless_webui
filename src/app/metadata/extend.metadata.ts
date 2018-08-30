const form = [
  {
    key: 'extend',
    type: 'extend'
  },
  {
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: true,
    key: 'skill',
    hide: true,
    templateOptions: {
      label: 'Position',
      add: false,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    query: {
      job: '{id}'
    }
  },
  {
    endpoint: '/ecore/api/v2/hr/jobs/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Job',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    key: 'job',
  },
];

export const metadata = {
  form
};
