const list = {
  list: {
    list: 'smsmessage',
    label: 'SMS message',
    columns: [
      {
        content: [
          {
            field: 'sid',
            type: 'textarea'
          }
        ],
        name: 'sid',
        sort_field: 'sid',
        label: 'SID',
        sort: true
      },
      {
        delim: null,
        label: '',
        sort: true,
        content: [
          {
            endpoint: '/ecore/api/v2/sms-interface/smstemplates/{template.id}',
            field: 'template',
            type: 'link'
          }
        ],
        name: 'template',
        title: null,
        sort_field: 'template'
      },
      {
        content: [
          {
            field: 'from_number',
            type: 'input'
          }
        ],
        name: 'from_number',
        sort_field: 'from_number',
        label: 'From number',
        sort: true
      },
      {
        content: [
          {
            field: 'to_number',
            type: 'input'
          }
        ],
        name: 'to_number',
        sort_field: 'to_number',
        label: 'To number',
        sort: true
      },
      {
        content: [
          {
            values: {
              ACCEPTED: 'Accepted',
              SENT: 'Sent',
              QUEUED: 'Queued',
              SENDING: 'Sending',
              FAILED: 'Failed',
              DELIVERED: 'Delivered',
              UNDELIVERED: 'Undelivered',
              RECEIVED: 'Received'
            },
            field: 'status',
            type: 'select'
          }
        ],
        name: 'status',
        sort_field: 'status',
        label: 'Status',
        sort: true
      },
      {
        content: [
          {
            field: 'sent_at',
            type: 'datepicker'
          }
        ],
        name: 'sent_at',
        sort_field: 'sent_at',
        label: 'Sent at',
        sort: true
      },
      {
        content: [
          {
            field: 'delivered_received_datetime',
            type: 'static'
          }
        ],
        name: 'delivered_received_datetime',
        label: 'Delivered received datetime'
      },
      {
        content: [
          {
            field: 'related',
            type: 'static',
            label: 'Links'
          }
        ],
        name: 'links',
        title: null,
        label: 'Links',
        delim: null
      }
    ],
    pagination_label: 'SMS message',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'type',
        label: 'Type',
        options: [
          {
            value: 'SENT',
            label: 'SMS sent'
          },
          {
            value: 'RECEIVED',
            label: 'SMS received'
          }
        ],
        query: 'type',
        default: null,
        type: 'select'
      },
      {
        key: 'status',
        label: 'Status',
        options: [
          {
            value: 'ACCEPTED',
            label: 'Accepted'
          },
          {
            value: 'SENT',
            label: 'Sent'
          },
          {
            value: 'QUEUED',
            label: 'Queued'
          },
          {
            value: 'SENDING',
            label: 'Sending'
          },
          {
            value: 'FAILED',
            label: 'Failed'
          },
          {
            value: 'DELIVERED',
            label: 'Delivered'
          },
          {
            value: 'UNDELIVERED',
            label: 'Undelivered'
          },
          {
            value: 'RECEIVED',
            label: 'Received'
          }
        ],
        query: 'status',
        default: null,
        type: 'select'
      },
      {
        key: 'template',
        label: 'Template',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/sms-interface/smstemplates/',
          key: 'id'
        },
        query: 'template'
      },
      {
        list: [
          {
            label: 'Yesterday',
            query: 'created_at_0=2018-07-03&created_at_1=2018-07-03'
          },
          {
            label: 'Today',
            query: 'created_at_0=2018-07-04&created_at_1=2018-07-04'
          }
        ],
        key: 'created_at',
        label: 'Created at',
        type: 'date',
        input: [
          {
            label: 'From date',
            query: 'created_at_0'
          },
          {
            label: 'To date',
            query: 'created_at_1'
          }
        ]
      },
      {
        key: 'check_reply',
        label: 'Check reply status after timeout',
        options: [
          {
            value: 'True',
            label: 'Yes'
          },
          {
            value: 'False',
            label: 'No'
          }
        ],
        query: 'check_reply',
        default: null,
        type: 'checkbox'
      },
      {
        key: 'is_fake',
        label: 'Fake sms',
        options: [
          {
            value: 'True',
            label: 'Yes'
          },
          {
            value: 'False',
            label: 'No'
          }
        ],
        query: 'is_fake',
        default: null,
        type: 'checkbox'
      }
    ]
  },
  fields: [
    {
      key: 'template',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: null,
        text: ''
      },
      read_only: true
    },
    {
      key: 'status',
      type: 'select',
      templateOptions: {
        required: false,
        label: 'Status',
        options: [
          {
            value: 'ACCEPTED',
            label: 'Accepted'
          },
          {
            value: 'SENT',
            label: 'Sent'
          },
          {
            value: 'QUEUED',
            label: 'Queued'
          },
          {
            value: 'SENDING',
            label: 'Sending'
          },
          {
            value: 'FAILED',
            label: 'Failed'
          },
          {
            value: 'DELIVERED',
            label: 'Delivered'
          },
          {
            value: 'UNDELIVERED',
            label: 'Undelivered'
          },
          {
            value: 'RECEIVED',
            label: 'Received'
          }
        ],
        type: 'select'
      },
      read_only: true
    },
    {
      key: 'delivered_received_datetime',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Delivered received datetime',
        type: 'static'
      },
      read_only: true
    },
    {
      key: 'sid',
      type: 'textarea',
      templateOptions: {
        required: false,
        label: 'SID',
        description: 'Twillio Message ID',
        type: 'textarea'
      },
      read_only: true
    },
    {
      key: 'related',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Links',
        type: 'static'
      },
      read_only: true
    },
    {
      key: 'to_number',
      type: 'input',
      templateOptions: {
        required: true,
        label: 'To number',
        type: 'text',
        max: 25
      },
      read_only: true
    },
    {
      key: 'from_number',
      default: '',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'From number',
        type: 'text',
        max: 25
      },
      read_only: true
    },
    {
      key: 'sent_at',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Sent at',
        type: 'datetime'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    key: 'from_number',
    default: '',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'From number',
      max: 25,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'to_number',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'To number',
      max: 25,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'text',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Text message',
      type: 'textarea'
    },
    read_only: false
  },
  {
    key: 'type',
    default: 'SENT',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Type',
      type: 'select',
      options: [
        {
          value: 'SENT',
          label: 'SMS sent'
        },
        {
          value: 'RECEIVED',
          label: 'SMS received'
        }
      ]
    },
    read_only: false
  },
  {
    key: 'status',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Status',
      type: 'select',
      options: [
        {
          value: 'ACCEPTED',
          label: 'Accepted'
        },
        {
          value: 'SENT',
          label: 'Sent'
        },
        {
          value: 'QUEUED',
          label: 'Queued'
        },
        {
          value: 'SENDING',
          label: 'Sending'
        },
        {
          value: 'FAILED',
          label: 'Failed'
        },
        {
          value: 'DELIVERED',
          label: 'Delivered'
        },
        {
          value: 'UNDELIVERED',
          label: 'Undelivered'
        },
        {
          value: 'RECEIVED',
          label: 'Received'
        }
      ]
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smstemplates/',
    read_only: true,
    templateOptions: {
      label: 'Template',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'template',
    many: false
  },
  {
    key: 'sent_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Sent at',
      type: 'datetime'
    },
    read_only: false
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
    key: 'reply_timeout',
    default: 4,
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
    default: 4,
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
    key: 'error_message',
    default: '',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Error message',
      type: 'textarea'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: null,
    read_only: true,
    templateOptions: {
      label: 'Related',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'related',
    many: true
  }
];

const formadd = [
  {
    key: 'from_number',
    default: '',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'From number',
      max: 25,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'to_number',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'To number',
      max: 25,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'text',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Text message',
      type: 'textarea'
    },
    read_only: false
  },
  {
    key: 'type',
    default: 'SENT',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Type',
      type: 'select',
      options: [
        {
          value: 'SENT',
          label: 'SMS sent'
        },
        {
          value: 'RECEIVED',
          label: 'SMS received'
        }
      ]
    },
    read_only: false
  },
  {
    key: 'status',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Status',
      type: 'select',
      options: [
        {
          value: 'ACCEPTED',
          label: 'Accepted'
        },
        {
          value: 'SENT',
          label: 'Sent'
        },
        {
          value: 'QUEUED',
          label: 'Queued'
        },
        {
          value: 'SENDING',
          label: 'Sending'
        },
        {
          value: 'FAILED',
          label: 'Failed'
        },
        {
          value: 'DELIVERED',
          label: 'Delivered'
        },
        {
          value: 'UNDELIVERED',
          label: 'Undelivered'
        },
        {
          value: 'RECEIVED',
          label: 'Received'
        }
      ]
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smstemplates/',
    read_only: true,
    templateOptions: {
      label: 'Template',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'template',
    many: false
  },
  {
    key: 'sent_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Sent at',
      type: 'datetime'
    },
    read_only: false
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
    key: 'reply_timeout',
    default: 4,
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
    default: 4,
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
    key: 'error_message',
    default: '',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Error message',
      type: 'textarea'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: null,
    read_only: true,
    templateOptions: {
      label: 'Related',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'related',
    many: true
  }
];

export const metadata = {
  list,
  form,
  formadd
};