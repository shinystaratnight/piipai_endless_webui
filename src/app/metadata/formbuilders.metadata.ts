const list = {
  list: {
    list: 'formbuilder',
    label: 'Form builder',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Form Builder'
      }
    ],
    pagination_label: 'Form builder',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Form Builder',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/core/forms/',
    read_only: true,
    templateOptions: {
      label: 'Forms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'forms',
    many: true
  },
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      label: 'Id',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Updated at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Created at',
      type: 'datetime'
    },
    read_only: true
  },
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
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/core/forms/',
    read_only: true,
    templateOptions: {
      label: 'Forms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'forms',
    many: true
  },
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      label: 'Id',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Updated at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Created at',
      type: 'datetime'
    },
    read_only: true
  },
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
  }
];

export const metadata = {
  list,
  form,
  formadd
};
