const list = {
  list: {
    list: 'joboffer',
    label: 'Job Offer',
    columns: [
      {
        sort_field: 'shift.date.shift_date',
        sorted: 'desc',
        sort: true,
        content: [{ field: 'shift.date.shift_date', type: 'datepicker' }],
        name: 'shift.date.shift_date',
        label: 'Shift date'
      },
      {
        content: [
          {
            values: { '0': 'Undefined', '1': 'Accepted', '2': 'Cancelled' },
            field: 'status',
            type: 'select'
          }
        ],
        name: 'status',
        sort_field: 'status',
        label: 'Status',
        sort: true
      }
    ],
    pagination_label: 'Job Offer',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'candidate_contact',
        label: 'Candidate contact',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
          key: 'id'
        },
        query: 'candidate_contact'
      }
    ]
  },
  fields: [
    {
      key: 'shift.date.shift_date',
      type: 'datepicker',
      templateOptions: { required: true, label: 'Shift date', type: 'date' },
      read_only: true
    },
    {
      key: 'status',
      default: 0,
      type: 'select',
      templateOptions: {
        required: false,
        label: 'Status',
        options: [
          { value: 0, label: 'Undefined' },
          { value: 1, label: 'Accepted' },
          { value: 2, label: 'Cancelled' }
        ],
        type: 'select'
      },
      read_only: true
    }
  ]
};

const formset = {
  fields: [
    {
      key: 'offer_sent_by_sms.id',
      templateOptions: {
        action: 'editModal',
        label: '',
        type: 'button',
        text: 'Offer'
      },
      type: 'button'
    },
    {
      key: 'candidate_rate',
      read_only: true,
      templateOptions: {
        required: false,
        display: '${field}/h',
        label: 'Candidate rate',
        type: 'static'
      },
      type: 'static'
    },
    {
      many: false,
      key: 'candidate_contact',
      endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Candidate contact',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      key: 'shift.time',
      read_only: false,
      templateOptions: { required: true, label: 'Time', type: 'time' },
      type: 'datepicker'
    },
    {
      key: 'reply_received_by_sms.id',
      templateOptions: {
        action: 'editModal',
        label: '',
        type: 'button',
        text: 'Reply'
      },
      type: 'button'
    },
    {
      key: 'shift.date.shift_date',
      read_only: false,
      templateOptions: { required: true, label: 'Shift date', type: 'date' },
      type: 'datepicker'
    },
    {
      key: 'has_accept_action',
      templateOptions: {
        action: 'emptyPost',
        label: '',
        type: 'button',
        text: ''
      },
      type: 'button'
    },
    {
      showIf: ['scheduled_sms_datetime'],
      key: 'scheduled_sms_datetime',
      read_only: false,
      templateOptions: { required: false, label: 'Sheduled', type: 'datetime' },
      type: 'datepicker'
    },
    {
      key: 'has_send_action',
      templateOptions: {
        action: 'emptyPost',
        label: '',
        type: 'button',
        text: ''
      },
      type: 'button'
    },
    {
      key: 'timesheets',
      templateOptions: {
        link: null,
        label: 'Timesheets',
        type: 'link',
        text: 'Link to TimeSheet'
      },
      type: 'link'
    },
    {
      key: 'client_rate',
      read_only: true,
      templateOptions: {
        required: false,
        display: '${field}/h',
        label: 'Client rate',
        type: 'static'
      },
      type: 'static'
    },
    {
      key: 'has_cancel_action',
      templateOptions: {
        action: 'emptyPost',
        label: '',
        type: 'button',
        text: ''
      },
      type: 'button'
    },
    {
      default: 0,
      key: 'status',
      read_only: false,
      templateOptions: {
        required: false,
        options: [
          { value: 0, label: 'Undefined' },
          { value: 1, label: 'Accepted' },
          { value: 2, label: 'Cancelled' }
        ],
        values: {
          '0': 'minus-circle',
          '1': 'check-circle',
          '2': 'times-circle',
          null: 'minus-circle'
        },
        label: 'Status',
        type: 'select'
      },
      type: 'select'
    },
    {
      key: 'has_resend_action',
      templateOptions: {
        action: 'emptyPost',
        label: '',
        type: 'button',
        text: ''
      },
      type: 'button'
    },
    {
      key: 'id',
      templateOptions: {
        action: 'delete',
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
        name: 'candidate_contact',
        sort: true,
        sort_field: 'candidate_contact',
        content: [
          {
            endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
            type: 'related',
            field: 'candidate_contact'
          }
        ],
        label: 'Candidate contact'
      },
      {
        name: 'shift.date.shift_date',
        sorted: 'desc',
        sort_field: 'shift.date.shift_date',
        label: 'Shift date',
        content: [{ type: 'datepicker', field: 'shift.date.shift_date' }],
        sort: true
      },
      {
        name: 'shift.time',
        sort: true,
        sort_field: 'shift.time',
        content: [{ type: 'datepicker', field: 'shift.time' }],
        label: 'Time'
      },
      {
        name: 'status',
        content: [
          {
            values: {
              '0': 'minus-circle',
              '1': 'check-circle',
              '2': 'times-circle',
              null: 'minus-circle'
            },
            type: 'icon',
            field: 'status'
          },
          {
            values: { '0': 'Undefined', '1': 'Accepted', '2': 'Cancelled' },
            type: 'select',
            field: 'status'
          }
        ],
        label: 'Status',
        title: null,
        delim: ' '
      },
      {
        name: 'sms_history',
        content: [
          {
            showIf: ['scheduled_sms_datetime'],
            label: 'Sheduled',
            type: 'datepicker',
            field: 'scheduled_sms_datetime'
          },
          {
            action: 'editModal',
            text: 'Offer',
            endpoint: '/ecore/api/v2/sms-interface/smsmessages/{field}',
            type: 'button',
            field: 'offer_sent_by_sms.id'
          },
          {
            action: 'editModal',
            text: 'Reply',
            endpoint: '/ecore/api/v2/sms-interface/smsmessages/{field}',
            type: 'button',
            field: 'reply_received_by_sms.id'
          }
        ],
        label: 'SMS History',
        title: null,
        delim: ' '
      },
      {
        name: 'client/candidate_rate',
        content: [
          { display: '${field}/h', type: 'static', field: 'client_rate' },
          { display: '${field}/h', type: 'static', field: 'candidate_rate' }
        ],
        label: 'Client/Candidate Rate',
        title: null,
        delim: ' / '
      },
      {
        name: 'timesheets',
        sort_field: 'timesheets',
        title: null,
        sort: true,
        content: [
          {
            text: 'Link to TimeSheet',
            endpoint: '/ecore/api/v2/hr/timesheets/{timesheets}',
            label: 'Timesheets',
            type: 'link',
            field: 'timesheets'
          }
        ],
        label: 'Timesheets',
        delim: null
      },
      {
        name: 'actions',
        content: [
          {
            action: 'emptyPost',
            endpoint: '/ecore/api/v2/hr/joboffers/{id}/accept',
            icon: 'fa-check-circle',
            title: 'Accept',
            text_color: '#5cb85c',
            type: 'button',
            field: 'has_accept_action'
          },
          {
            action: 'emptyPost',
            endpoint: '/ecore/api/v2/hr/joboffers/{id}/cancel',
            icon: 'fa-minus-circle',
            title: 'Cancel',
            text_color: '#f32700',
            type: 'button',
            field: 'has_cancel_action'
          },
          {
            action: 'emptyPost',
            endpoint: '/ecore/api/v2/hr/joboffers/{id}/send',
            icon: 'fa-commenting',
            title: 'Send JO',
            text_color: '#f0ad4e',
            type: 'button',
            field: 'has_send_action'
          },
          {
            action: 'emptyPost',
            endpoint: '/ecore/api/v2/hr/joboffers/{id}/resend',
            icon: 'fa-commenting',
            title: 'Resend JO',
            text_color: '#f0ad4e',
            type: 'button',
            field: 'has_resend_action'
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
        delim: ' '
      }
    ],
    list: 'joboffer',
    editDisable: false,
    label: 'Job Offer',
    pagination_label: 'Job Offer',
    search_enabled: false
  }
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
    key: 'shift.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    key: 'shift.time',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Time', type: 'time' },
    read_only: false
  },
  {
    key: 'shift.date.shift_date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Shift date', type: 'date' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/shiftdates/',
    read_only: false,
    templateOptions: {
      label: 'Date',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'shift.date',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/shifts/',
    read_only: false,
    templateOptions: {
      label: 'Shift',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'shift',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_contact',
    many: false
  },
  {
    key: 'offer_sent_by_sms.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: false,
    templateOptions: {
      label: 'Offer sent by sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'offer_sent_by_sms',
    many: false
  },
  {
    key: 'reply_received_by_sms.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: false,
    templateOptions: {
      label: 'Reply received by sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'reply_received_by_sms',
    many: false
  },
  {
    key: 'status',
    default: 0,
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Status',
      type: 'select',
      options: [
        { value: 0, label: 'Undefined' },
        { value: 1, label: 'Accepted' },
        { value: 2, label: 'Cancelled' }
      ]
    },
    read_only: false
  },
  {
    key: 'scheduled_sms_datetime',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Scheduled date',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'offer_sent_by_sms.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: false,
    templateOptions: {
      label: 'Offer sent by sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'offer_sent_by_sms',
    many: false
  },
  {
    key: 'reply_received_by_sms.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: false,
    templateOptions: {
      label: 'Reply received by sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'reply_received_by_sms',
    many: false
  },
  {
    key: 'shift.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    key: 'shift.time',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Time', type: 'time' },
    read_only: false
  },
  {
    key: 'shift.date.shift_date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Shift date', type: 'date' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/shiftdates/',
    read_only: false,
    templateOptions: {
      label: 'Date',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'shift.date',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/shifts/',
    read_only: false,
    templateOptions: {
      label: 'Shift',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'shift',
    many: false
  },
  {
    key: 'candidate_rate',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Candidate rate',
      type: 'static'
    },
    read_only: true
  },
  {
    key: 'client_rate',
    type: 'static',
    templateOptions: { required: false, label: 'Client rate', type: 'static' },
    read_only: true
  },
  {
    key: 'timesheets',
    type: 'static',
    templateOptions: { required: false, label: 'Timesheets', type: 'static' },
    read_only: true
  },
  {
    key: 'has_accept_action',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Has accept action',
      type: 'static'
    },
    read_only: true
  },
  {
    key: 'has_cancel_action',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Has cancel action',
      type: 'static'
    },
    read_only: true
  },
  {
    key: 'has_resend_action',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Has resend action',
      type: 'static'
    },
    read_only: true
  },
  {
    key: 'has_send_action',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Has send action',
      type: 'static'
    },
    read_only: true
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
    key: 'shift.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    key: 'shift.time',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Time', type: 'time' },
    read_only: false
  },
  {
    key: 'shift.date.shift_date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Shift date', type: 'date' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/shiftdates/',
    read_only: false,
    templateOptions: {
      label: 'Date',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'shift.date',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/shifts/',
    read_only: false,
    templateOptions: {
      label: 'Shift',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'shift',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_contact',
    many: false
  },
  {
    key: 'offer_sent_by_sms.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: false,
    templateOptions: {
      label: 'Offer sent by sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'offer_sent_by_sms',
    many: false
  },
  {
    key: 'reply_received_by_sms.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: false,
    templateOptions: {
      label: 'Reply received by sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'reply_received_by_sms',
    many: false
  },
  {
    key: 'status',
    default: 0,
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Status',
      type: 'select',
      options: [
        { value: 0, label: 'Undefined' },
        { value: 1, label: 'Accepted' },
        { value: 2, label: 'Cancelled' }
      ]
    },
    read_only: false
  },
  {
    key: 'scheduled_sms_datetime',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Scheduled date',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'offer_sent_by_sms.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: false,
    templateOptions: {
      label: 'Offer sent by sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'offer_sent_by_sms',
    many: false
  },
  {
    key: 'reply_received_by_sms.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: false,
    templateOptions: {
      label: 'Reply received by sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'reply_received_by_sms',
    many: false
  },
  {
    key: 'shift.id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    key: 'shift.time',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Time', type: 'time' },
    read_only: false
  },
  {
    key: 'shift.date.shift_date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Shift date', type: 'date' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/shiftdates/',
    read_only: false,
    templateOptions: {
      label: 'Date',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'shift.date',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/shifts/',
    read_only: false,
    templateOptions: {
      label: 'Shift',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'shift',
    many: false
  },
  {
    key: 'candidate_rate',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Candidate rate',
      type: 'static'
    },
    read_only: true
  },
  {
    key: 'client_rate',
    type: 'static',
    templateOptions: { required: false, label: 'Client rate', type: 'static' },
    read_only: true
  },
  {
    key: 'timesheets',
    type: 'static',
    templateOptions: { required: false, label: 'Timesheets', type: 'static' },
    read_only: true
  },
  {
    key: 'has_accept_action',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Has accept action',
      type: 'static'
    },
    read_only: true
  },
  {
    key: 'has_cancel_action',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Has cancel action',
      type: 'static'
    },
    read_only: true
  },
  {
    key: 'has_resend_action',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Has resend action',
      type: 'static'
    },
    read_only: true
  },
  {
    key: 'has_send_action',
    type: 'static',
    templateOptions: {
      required: false,
      label: 'Has send action',
      type: 'static'
    },
    read_only: true
  }
];
const extend = {
  fields: [
    {
      many: false,
      key: 'candidate_contact',
      endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Candidate',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      key: 'shift.time',
      read_only: false,
      templateOptions: {
        required: true,
        label: 'Shift start time',
        type: 'time'
      },
      type: 'datepicker'
    }
  ],
  list: {
    columns: [
      {
        name: 'shift_start_time',
        content: [
          { label: 'Shift start time', type: 'datepicker', field: 'shift.time' }
        ],
        label: 'Shift start time',
        title: null,
        delim: null
      },
      {
        name: 'candidate',
        content: [
          {
            endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
            label: 'Candidate',
            type: 'related',
            field: 'candidate_contact'
          }
        ],
        label: 'Candidate',
        title: null,
        delim: null
      }
    ],
    list: 'joboffer',
    editDisable: false,
    label: 'Job Offer',
    pagination_label: 'Job Offer',
    search_enabled: false
  }
};

export const metadata = {
  list,
  form,
  formset,
  formadd,
  extend
};
