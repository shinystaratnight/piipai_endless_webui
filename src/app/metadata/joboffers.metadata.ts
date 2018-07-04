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

export const metadata = {
  list,
  form,
  formadd
};
