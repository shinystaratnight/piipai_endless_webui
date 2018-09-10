const form = [
  {
    key: 'job_shift',
    type: 'extend'
  },
  {
    hide: true,
    key: 'default_shift_starting_time',
    default: '07:00:00',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Default Shift Starting Time',
      type: 'time'
    },
    read_only: false
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
