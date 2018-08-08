const list = {
  list: {
    list: 'smstemplate',
    label: 'SMS Template',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Sms Template'
      }
    ],
    pagination_label: 'SMS Template',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Sms Template',
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
    key: 'name',
    default: '',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Name',
      max: 256,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'slug',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Slug',
      max: 50,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'message_text_template',
    default: '',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Text template',
    },
    read_only: false
  },
  {
    key: 'reply_timeout',
    default: 10,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Reply timeout',
      type: 'number',
      min: -2147483648,
      description: 'Minutes',
      max: 2147483647
    },
    read_only: false
  },
  {
    key: 'delivery_timeout',
    default: 10,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Delivery timeout',
      type: 'number',
      min: -2147483648,
      description: 'Minutes',
      max: 2147483647
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companies/',
    read_only: true,
    templateOptions: {
      label: 'Company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'company',
    many: false
  },
  {
    key: 'type',
    type: 'select',
    templateOptions: {
      required: true,
      label: 'Type',
      type: 'select',
      options: [
        {
          value: 'sms',
          label: 'SMS'
        }
      ]
    },
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
    key: 'name',
    default: '',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Name',
      max: 256,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'slug',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Slug',
      max: 50,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'message_text_template',
    default: '',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Text template',
      type: 'text'
    },
  },
  {
    key: 'reply_timeout',
    default: 10,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Reply timeout',
      type: 'number',
      min: -2147483648,
      description: 'Minutes',
      max: 2147483647
    },
    read_only: false
  },
  {
    key: 'delivery_timeout',
    default: 10,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Delivery timeout',
      type: 'number',
      min: -2147483648,
      description: 'Minutes',
      max: 2147483647
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companies/',
    read_only: true,
    templateOptions: {
      label: 'Company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'company',
    many: false
  },
  {
    key: 'type',
    type: 'select',
    templateOptions: {
      required: true,
      label: 'Type',
      type: 'select',
      options: [
        {
          value: 'sms',
          label: 'SMS'
        }
      ]
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
