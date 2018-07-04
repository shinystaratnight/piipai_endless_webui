const list = {
  list: {
    list: 'carrierlist',
    label: 'Carrier List',
    columns: [
      {
        content: [
          {
            endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
            field: 'candidate_contact',
            type: 'related'
          }
        ],
        name: 'candidate_contact',
        sort_field: 'candidate_contact',
        label: 'Candidate contact',
        sort: true
      },
      {
        content: [{ field: 'target_date', type: 'datepicker' }],
        name: 'target_date',
        sort_field: 'target_date',
        label: 'Target Date',
        sort: true
      },
      {
        content: [{ field: 'confirmed_available', type: 'checkbox' }],
        name: 'confirmed_available',
        sort_field: 'confirmed_available',
        label: 'Confirmed Available',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/hr/joboffers/',
            field: 'job_offer',
            type: 'related'
          }
        ],
        name: 'job_offer',
        sort_field: 'job_offer',
        label: 'Job offer',
        sort: true
      }
    ],
    pagination_label: 'Carrier List',
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
      list: false,
      endpoint: '/ecore/api/v2/hr/joboffers/',
      read_only: true,
      templateOptions: {
        label: 'Job offer',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'job_offer',
      many: false
    },
    {
      key: 'target_date',
      type: 'datepicker',
      templateOptions: { required: false, label: 'Target Date', type: 'date' },
      read_only: true
    },
    {
      key: 'confirmed_available',
      default: false,
      type: 'checkbox',
      templateOptions: {
        required: false,
        label: 'Confirmed Available',
        type: 'checkbox'
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
    key: 'target_date',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Target Date', type: 'date' },
    read_only: false
  },
  {
    key: 'confirmed_available',
    default: false,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Confirmed Available',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Sent message',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'sent_message',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Reply message',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'reply_message',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/joboffers/',
    read_only: true,
    templateOptions: {
      label: 'Job offer',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'job_offer',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/joboffers/',
    read_only: true,
    templateOptions: {
      label: 'Referral job offer',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'referral_job_offer',
    many: false
  },
  {
    key: 'sms_sending_scheduled_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'SMS sending scheduled at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    list: false,
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
    collapsed: false,
    type: 'related',
    key: 'skill',
    many: false
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
    key: 'target_date',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Target Date', type: 'date' },
    read_only: false
  },
  {
    key: 'confirmed_available',
    default: false,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Confirmed Available',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Sent message',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'sent_message',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Reply message',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'reply_message',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/joboffers/',
    read_only: true,
    templateOptions: {
      label: 'Job offer',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'job_offer',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/joboffers/',
    read_only: true,
    templateOptions: {
      label: 'Referral job offer',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'referral_job_offer',
    many: false
  },
  {
    key: 'sms_sending_scheduled_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'SMS sending scheduled at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    list: false,
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
    collapsed: false,
    type: 'related',
    key: 'skill',
    many: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
