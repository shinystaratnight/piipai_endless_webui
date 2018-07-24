const list = {
  list: {
    pagination_label: 'Skill Base Rate',
    label: 'Skill Base Rate',
    editDisable: false,
    columns: [
      {
        sort_field: 'hourly_rate',
        label: 'Hourly Rate',
        sort: true,
        title: null,
        name: 'hourly_rate',
        delim: null,
        content: [
          {
            field: 'hourly_rate',
            type: 'text'
          }
        ]
      }
    ],
    list: 'skillbaserate',
    search_enabled: true
  },
  fields: [
    {
      key: 'hourly_rate',
      type: 'input',
      templateOptions: {
        required: false,
        type: 'text',
        label: 'Hourly Rate'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      type: 'text',
      label: 'Id'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      type: 'datetime',
      label: 'Updated at'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      type: 'datetime',
      label: 'Created at'
    },
    read_only: true
  },
  {
    endpoint: '/ecore/api/v2/skills/skills/',
    key: 'skill',
    templateOptions: {
      add: true,
      label: 'Skill',
      values: ['__str__'],
      type: 'related',
      edit: true,
      delete: false
    },
    read_only: true,
    collapsed: false,
    many: false,
    type: 'related',
    list: false
  },
  {
    key: 'hourly_rate',
    type: 'input',
    templateOptions: {
      required: false,
      type: 'number',
      label: 'Hourly Rate'
    },
    read_only: false
  },
  {
    key: 'default_rate',
    type: 'checkbox',
    templateOptions: {
      required: false,
      type: 'checkbox',
      label: 'Is Default Rate'
    },
    default: false,
    read_only: false
  }
];

const formadd = [
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      type: 'text',
      label: 'Id'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      type: 'datetime',
      label: 'Updated at'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      type: 'datetime',
      label: 'Created at'
    },
    read_only: true
  },
  {
    endpoint: '/ecore/api/v2/skills/skills/',
    key: 'skill',
    templateOptions: {
      add: true,
      label: 'Skill',
      values: ['__str__'],
      type: 'related',
      edit: true,
      delete: false
    },
    read_only: true,
    collapsed: false,
    many: false,
    type: 'related',
    list: false
  },
  {
    key: 'hourly_rate',
    type: 'input',
    templateOptions: {
      required: false,
      type: 'number',
      label: 'Hourly Rate'
    },
    read_only: false
  },
  {
    key: 'default_rate',
    type: 'checkbox',
    templateOptions: {
      required: false,
      type: 'checkbox',
      label: 'Is Default Rate'
    },
    default: false,
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
}