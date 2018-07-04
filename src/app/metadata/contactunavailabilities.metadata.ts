const list = {
  list: {
    list: 'contactunavailability',
    label: 'Contact Unavailability',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Contact Unavailability'
      }
    ],
    pagination_label: 'Contact Unavailability',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'contact',
        label: 'Contact',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/contacts/',
          key: 'id'
        },
        query: 'contact'
      }
    ]
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Contact Unavailability',
        type: 'static'
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
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Updated at', type: 'datetime' },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Created at', type: 'datetime' },
    read_only: true
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/contacts/',
    read_only: true,
    templateOptions: {
      label: 'Contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'contact',
    many: false
  },
  {
    key: 'unavailable_from',
    type: 'datepicker',
    templateOptions: { required: false, label: 'From', type: 'date' },
    read_only: false
  },
  {
    key: 'unavailable_until',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Until', type: 'date' },
    read_only: false
  },
  {
    key: 'notes',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Notes',
      type: 'text',
      description: 'Unavailability Description'
    },
    read_only: false
  }
];

const formadd = [
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Updated at', type: 'datetime' },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Created at', type: 'datetime' },
    read_only: true
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/contacts/',
    read_only: true,
    templateOptions: {
      label: 'Contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'contact',
    many: false
  },
  {
    key: 'unavailable_from',
    type: 'datepicker',
    templateOptions: { required: false, label: 'From', type: 'date' },
    read_only: false
  },
  {
    key: 'unavailable_until',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Until', type: 'date' },
    read_only: false
  },
  {
    key: 'notes',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Notes',
      type: 'text',
      description: 'Unavailability Description'
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
