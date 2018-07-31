const list = {
  fields: [
    {
      key: '__str__',
      read_only: true,
      templateOptions: {
        required: false,
        label: 'Shift',
        type: 'static'
      },
      type: 'static'
    }
  ],
  list: {
    columns: [
      {
        name: '__str__',
        content: [
          {
            type: 'static',
            field: '__str__'
          }
        ],
        label: 'Shift'
      }
    ],
    list: 'shift',
    editDisable: false,
    label: 'Shift',
    pagination_label: 'Shift',
    search_enabled: false
  }
};

const form = [
  {
    many: false,
    key: 'date',
    endpoint: '/ecore/api/v2/hr/shiftdates/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Date',
      type: 'related'
    },
    read_only: false,
    type: 'related'
  },
  {
    key: 'time',
    read_only: false,
    templateOptions: {
      required: true,
      label: 'Time',
      type: 'time'
    },
    type: 'datepicker'
  },
  {
    default: 1,
    key: 'workers',
    read_only: false,
    templateOptions: {
      min: 1,
      required: false,
      label: 'Workers',
      max: 32767,
      type: 'number'
    },
    type: 'input'
  },
  {
    many: false,
    key: 'hourly_rate',
    endpoint: '/ecore/api/v2/skills/skillbaserates/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Hourly rate',
      type: 'related'
    },
    read_only: false,
    type: 'related'
  }
];

const formadd = [
  {
    many: false,
    key: 'date',
    endpoint: '/ecore/api/v2/hr/shiftdates/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Date',
      type: 'related'
    },
    read_only: false,
    type: 'related'
  },
  {
    key: 'time',
    read_only: false,
    templateOptions: {
      required: true,
      label: 'Time',
      type: 'time'
    },
    type: 'datepicker'
  },
  {
    default: 1,
    key: 'workers',
    read_only: false,
    templateOptions: {
      min: 1,
      required: false,
      label: 'Workers',
      max: 32767,
      type: 'number'
    },
    type: 'input'
  },
  {
    many: false,
    key: 'hourly_rate',
    endpoint: '/ecore/api/v2/skills/skillbaserates/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Hourly rate',
      type: 'related'
    },
    read_only: false,
    type: 'related'
  }
];

const shiftDate = {
  fields: [
    {
      key: 'date',
      endpoint: '/ecore/api/v2/hr/shiftdates/',
      hide: true,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Date',
        type: 'related'
      },
      type: 'related'
    },
    {
      key: 'time',
      read_only: false,
      templateOptions: {
        required: true,
        label: 'Time',
        type: 'time'
      },
      type: 'datepicker'
    },
    {
      default: 1,
      key: 'workers',
      read_only: false,
      templateOptions: {
        min: 1,
        required: false,
        label: 'Workers',
        max: 32767,
        type: 'number'
      },
      type: 'input'
    },
    {
      many: false,
      key: 'hourly_rate',
      endpoint: '/ecore/api/v2/skills/skillbaserates/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Hourly rate',
        type: 'related'
      },
      query: {
        skill: '{skill.id}'
      },
      prefilled: {
        skill: '{skill.id}'
      },
      read_only: false,
      type: 'related'
    }
  ],
  list: {
    columns: [
      {
        name: 'time',
        sorted: 'desc',
        sort_field: 'time',
        title: null,
        sort: true,
        content: [
          { label: 'Shift start time', type: 'datepicker', field: 'time' }
        ],
        label: 'Shift start time',
        delim: null
      },
      {
        name: 'workers',
        sort: true,
        sort_field: 'workers',
        content: [{ type: 'input', field: 'workers' }],
        label: 'Workers'
      },
      {
        name: 'candidate_rate',
        content: [
          {
            display: '${field}/h',
            label: 'Candidate rate',
            type: 'text',
            field: 'hourly_rate.hourly_rate'
          }
        ],
        label: 'Candidate rate',
        title: null,
        delim: null
      }
    ],
    buttons: [],
    list: 'shift',
    editDisable: false,
    label: 'Shift',
    pagination_label: 'Shift',
    search_enabled: false
  }
};

const job = {
  fields: [
    {
      key: 'is_fulfilled',
      read_only: true,
      templateOptions: {
        required: false,
        values: {
          '0': 'times-circle',
          '1': 'check-circle',
          '2': 'exclamation-circle',
          '3': 'minus-circle',
          null: 'minus-circle'
        },
        label: 'Fulfilled',
        type: 'icon'
      },
      type: 'checkbox'
    },
    {
      key: 'date.shift_date',
      read_only: false,
      templateOptions: { required: true, label: 'Date', type: 'date' },
      type: 'datepicker'
    },
    {
      default: 0.0,
      key: 'hourly_rate.hourly_rate',
      read_only: false,
      templateOptions: {
        required: false,
        display: '${field}/h',
        label: 'Candidate rate',
        type: 'text'
      },
      type: 'input'
    },
    {
      key: 'time',
      read_only: false,
      templateOptions: {
        required: true,
        label: 'Shift start time',
        type: 'time'
      },
      type: 'datepicker'
    },
    {
      default: 1,
      key: 'workers',
      read_only: false,
      templateOptions: {
        required: false,
        min: 1,
        label: 'Workers',
        max: 32767,
        type: 'number'
      },
      type: 'input'
    },
    {
      key: 'id',
      templateOptions: {
        action: 'editForm',
        label: '',
        type: 'button',
        text: ''
      },
      type: 'button'
    }
  ],
  list: {
    columns: [
      {
        name: 'date.shift_date',
        sorted: 'desc',
        sort_field: 'date.shift_date',
        title: null,
        sort: true,
        content: [
          { label: 'Date', type: 'datepicker', field: 'date.shift_date' }
        ],
        label: 'Date',
        delim: null
      },
      {
        name: 'workers',
        sort: true,
        sort_field: 'workers',
        content: [{ type: 'input', field: 'workers' }],
        label: 'Workers'
      },
      {
        name: 'candidate_rate',
        content: [
          {
            display: '${field}/h',
            label: 'Candidate rate',
            type: 'text',
            field: 'hourly_rate.hourly_rate'
          }
        ],
        label: 'Candidate rate',
        title: null,
        delim: null
      },
      {
        name: 'time',
        sorted: 'desc',
        sort_field: 'time',
        title: null,
        sort: true,
        content: [
          { label: 'Shift start time', type: 'datepicker', field: 'time' }
        ],
        label: 'Shift start time',
        delim: null
      },
      {
        name: 'fulfilled',
        content: [
          {
            values: {
              '0': 'times-circle',
              '1': 'check-circle',
              '2': 'exclamation-circle',
              '3': 'minus-circle',
              null: 'minus-circle'
            },
            label: 'Fulfilled',
            type: 'icon',
            field: 'is_fulfilled'
          }
        ],
        label: 'Fulfilled',
        title: null,
        delim: null
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/ecore/api/v2/hr/shiftdates/{id}',
            icon: 'fa-pencil',
            title: 'Edit',
            text_color: '#f0ad4e',
            type: 'button',
            field: 'id'
          },
          {
            action: 'delete',
            icon: 'fa-times-circle',
            title: 'Delete',
            text_color: '#f32700',
            type: 'button',
            field: 'id'
          }
        ],
        label: 'Actions',
        title: null,
        delim: null
      }
    ],
    buttons: [],
    list: 'shift',
    editDisable: false,
    label: 'Shift',
    pagination_label: 'Shift',
    search_enabled: false
  }
};

export const metadata = {
  list,
  job,
  form,
  formadd,
  shiftDate
};
