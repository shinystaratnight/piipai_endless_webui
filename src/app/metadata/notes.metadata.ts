const list = {
  list: {
    list: 'note',
    label: 'Contact Note',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Contact Note'
      }
    ],
    pagination_label: 'Contact Note',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Contact Note',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/contenttypes/contenttypes/',
    read_only: true,
    templateOptions: {
      label: 'Content type',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'content_type',
    many: false
  },
  {
    key: 'object_id',
    type: 'input',
    hide: true,
    templateOptions: { required: true, label: 'Object id', type: 'text' },
    read_only: false
  },
  {
    key: 'note',
    type: 'textarea',
    templateOptions: { required: false, label: 'Notes', type: 'textarea' },
    read_only: false
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/contenttypes/contenttypes/',
    read_only: true,
    templateOptions: {
      label: 'Content type',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'content_type',
    many: false
  },
  {
    key: 'object_id',
    type: 'input',
    hide: true,
    templateOptions: { required: true, label: 'Object id', type: 'text' },
    read_only: false
  },
  {
    key: 'note',
    type: 'textarea',
    templateOptions: { required: false, label: 'Notes', type: 'textarea' },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
