const list = {
  list: {
    list: 'shiftdate',
    label: 'Shift Date',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Shift Date'
      }
    ],
    pagination_label: 'Shift Date',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: { required: false, label: 'Shift Date', type: 'static' },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/jobs/',
    read_only: true,
    templateOptions: {
      label: 'Job',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'job',
    many: false
  },
  {
    key: 'shift_date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Shift date', type: 'date' },
    read_only: false
  },
  {
    key: 'workers',
    default: 1,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Workers',
      max: 32767,
      type: 'number',
      min: 1
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skillbaserates/',
    read_only: true,
    templateOptions: {
      label: 'Hourly rate',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'hourly_rate',
    many: false
  },
  {
    endpoint: '/ecore/api/v2/hr/shifts/',
    metadata_query: { editable_type: 'shift_date' },
    delay: true,
    templateOptions: {
      label: 'Shifts',
      type: 'list',
      add_label: 'Add',
      text: 'Shifts'
    },
    collapsed: false,
    prefilled: { date: '{id}' },
    type: 'list',
    query: { date: '{id}' }
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/jobs/',
    read_only: true,
    templateOptions: {
      label: 'Job',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'job',
    many: false
  },
  {
    key: 'shift_date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Shift date', type: 'date' },
    read_only: false
  },
  {
    key: 'workers',
    default: 1,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Workers',
      max: 32767,
      type: 'number',
      min: 1
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skillbaserates/',
    read_only: true,
    templateOptions: {
      label: 'Hourly rate',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'hourly_rate',
    many: false
  },
  {
    endpoint: '/ecore/api/v2/hr/shifts/',
    metadata_query: { editable_type: 'shift_date' },
    delay: true,
    templateOptions: {
      label: 'Shifts',
      type: 'list',
      add_label: 'Add',
      text: 'Shifts'
    },
    collapsed: false,
    prefilled: { date: '{id}' },
    type: 'list',
    query: { date: '{id}' }
  }
];

const jobAdd = [
  {
    hide: true,
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: true,
    templateOptions: {
      label: 'Skill',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    key: 'skill',
  },
  {
    hide: true,
    many: false,
    key: 'job',
    endpoint: '/ecore/api/v2/hr/jobs/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Job',
      type: 'related'
    },
    read_only: true,
    type: 'related'
  },
  {
    key: 'shift_date',
    read_only: false,
    templateOptions: {
      required: true,
      label: 'Shift date',
      type: 'date'
    },
    type: 'datepicker'
  },
  {
    prefilled: {
      date: '{id}'
    },
    list: true,
    send: false,
    key: 'shifts',
    endpoint: '/ecore/api/v2/hr/shifts/',
    delay: true,
    templateOptions: {
      add_label: 'Add',
      label: 'Shifts',
      type: 'related',
      text: 'Shifts'
    },
    metadata_query: {
      editable_type: 'shift_date'
    },
    showIf: ['shift_date'],
    defaultData: {
      date__shift_date: '{shift_date}',
      job: '{job.id}'
    },
    type: 'related',
  }
];

export const metadata = {
  list,
  form,
  formadd,
  jobAdd
};
