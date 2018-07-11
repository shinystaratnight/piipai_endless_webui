const list = {
  list: {
    list: 'timesheet',
    label: 'Timesheet Entry',
    columns: [
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/companies/{company.id}',
            field: 'company',
            type: 'link'
          },
          {
            endpoint: '/ecore/api/v2/hr/jobsites/{jobsite.id}',
            field: 'jobsite',
            type: 'link'
          },
          {
            endpoint: '/ecore/api/v2/core/companycontacts/{supervisor.id}',
            field: 'supervisor',
            type: 'link'
          }
        ],
        name: 'client_/_jobsite_/_supervisor',
        title: null,
        label: 'Client / Jobsite / Supervisor',
        delim: null
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/skills/skills/{position.id}',
            field: 'position',
            type: 'link'
          },
          {
            endpoint:
              '/ecore/api/v2/candidate/candidatecontacts/{job_offer.candidate_contact.id}',
            field: 'job_offer.candidate_contact',
            type: 'link'
          }
        ],
        name: 'position_/_candidate',
        title: null,
        label: 'Position / Candidate',
        delim: null
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/hr/jobs/{job.id}',
            field: 'job',
            type: 'link',
            text: 'Job'
          }
        ],
        name: 'links',
        title: null,
        label: 'Links',
        delim: ' / '
      },
      {
        content: [
          {
            field: 'shift_started_ended',
            type: 'static'
          }
        ],
        name: 'shift_started/ended',
        title: null,
        label: 'Shift started/ended',
        delim: null
      },
      {
        content: [
          {
            field: 'break_started_ended',
            type: 'static'
          }
        ],
        name: 'break_started/ended',
        title: null,
        label: 'Break started/ended',
        delim: null
      },
      {
        content: [
          {
            values: {
              false: 'times',
              true: 'check',
              null: 'minus-circle'
            },
            field: 'going_to_work_confirmation',
            type: 'icon',
            label: 'Morning check',
            showIf: [
              {
                going_to_work_confirmation: true
              }
            ]
          },
          {
            values: {
              false: 'times',
              true: 'check',
              null: 'minus-circle'
            },
            field: 'candidate_filled',
            type: 'icon',
            label: 'Candidate filled',
            showIf: [
              {
                candidate_filled: true
              }
            ]
          },
          {
            values: {
              false: 'times',
              true: 'check',
              null: 'minus-circle'
            },
            field: 'supervisor_approved',
            type: 'icon',
            label: 'Supervisor approved',
            showIf: [
              {
                supervisor_approved: true
              }
            ]
          },
          {
            endpoint:
              '/ecore/api/v2/sms-interface/smsmessages/{going_to_work_sent_sms.id}',
            field: 'going_to_work_sent_sms',
            icon: 'fa-commenting',
            action: 'editForm',
            type: 'button',
            text: 'Candidate Going To Work'
          },
          {
            endpoint:
              '/ecore/api/v2/sms-interface/smsmessages/{going_to_work_reply_sms.id}',
            field: 'going_to_work_reply_sms',
            icon: 'fa-commenting',
            action: 'editForm',
            type: 'button',
            text: 'Reply'
          }
        ],
        name: 'confirmations',
        title: null,
        label: 'Confirmations',
        delim: null
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/hr/timesheets/{id}/confirm',
            field: 'id',
            icon: 'fa-external-link',
            text: 'Confirm',
            label: 'Morning check:',
            showIf: [
              {
                going_to_work_confirmation: null
              }
            ],
            action: 'emptyPost',
            type: 'button'
          },
          {
            endpoint: '/ecore/api/v2/hr/timesheets/{id}/resend_sms',
            field: 'resend_sms_candidate',
            showIf: [
              {
                resend_sms_candidate: true
              }
            ],
            icon: 'fa-external-link',
            action: 'emptyPost',
            type: 'button',
            text: 'Send TS SMS'
          },
          {
            endpoint: '/ecore/api/v2/hr/timesheets/{id}/resend_supervisor_sms',
            field: 'resend_sms_supervisor',
            showIf: [
              {
                resend_sms_supervisor: true
              }
            ],
            icon: 'fa-external-link',
            action: 'emptyPost',
            type: 'button',
            text: 'Send Supervisor SMS'
          },
          {
            endpoint: '/ecore/api/v2/hr/timesheets/{id}/candidate_fill/',
            field: 'id',
            showIf: [
              {
                resend_sms_candidate: true
              }
            ],
            icon: 'fa-external-link',
            action: 'editForm',
            type: 'button',
            text: 'Fill'
          },
          {
            endpoint: '/ecore/api/v2/hr/timesheets/{id}/supervisor_approve/',
            field: 'id',
            showIf: [
              {
                resend_sms_supervisor: true
              }
            ],
            icon: 'fa-external-link',
            action: 'editForm',
            type: 'button',
            text: 'Approve'
          }
        ],
        name: 'actions',
        title: null,
        label: 'Actions',
        delim: null
      },
      {
        delim: null,
        label: 'Related sms',
        sort: true,
        content: [
          {
            endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
            field: 'related_sms',
            type: 'related'
          }
        ],
        name: 'related_sms',
        title: null,
        sort_field: 'related_sms'
      },
      {
        content: [
          {
            field: 'myob_status',
            type: 'text',
            showIf: [
              {
                show_sync_button: false
              }
            ]
          },
          {
            endpoint: '/ecore/api/v2/hr/timesheets/{id}/sync',
            field: 'id',
            showIf: [
              {
                show_sync_button: true
              }
            ],
            icon: 'fa-sync-alt',
            action: 'emptyPost',
            type: 'button',
            text: 'Sync'
          }
        ],
        name: 'myob_status',
        title: null,
        label: 'MYOB status',
        delim: null
      }
    ],
    pagination_label: 'Timesheet Entry',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        list: [
          {
            label: 'Yesterday',
            query: 'shift_started_at_0=2018-07-03&shift_started_at_1=2018-07-03'
          },
          {
            label: 'Today',
            query: 'shift_started_at_0=2018-07-04&shift_started_at_1=2018-07-04'
          },
          {
            label: 'Tomorrow',
            query: 'shift_started_at_0=2018-07-05&shift_started_at_1=2018-07-05'
          }
        ],
        key: 'shift_started_at',
        label: 'Shift Started at',
        type: 'date',
        input: [
          {
            label: 'From date',
            query: 'shift_started_at_0'
          },
          {
            label: 'To date',
            query: 'shift_started_at_1'
          }
        ]
      },
      {
        key: 'supervisor',
        label: 'Supervisor',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companycontacts/',
          key: 'id'
        },
        query: 'supervisor'
      },
      {
        key: 'candidate',
        label: 'Candidate Contact',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
          key: 'id'
        },
        query: 'candidate'
      },
      {
        key: 'company',
        label: 'Client',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companies/',
          key: 'id'
        },
        query: 'company'
      },
      {
        key: 'jobsite',
        label: 'Jobsite',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/hr/jobsites/',
          key: 'id'
        },
        query: 'jobsite'
      }
    ]
  },
  fields: [
    {
      key: 'going_to_work_confirmation',
      type: 'checkbox',
      showIf: [
        {
          going_to_work_confirmation: true
        }
      ],
      templateOptions: {
        required: false,
        label: 'Morning check',
        type: 'icon',
        values: {
          false: 'times',
          true: 'check',
          null: 'minus-circle'
        }
      },
      read_only: true
    },
    {
      key: 'company',
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
      key: 'supervisor_approved',
      type: 'checkbox',
      showIf: [
        {
          supervisor_approved: true
        }
      ],
      templateOptions: {
        required: false,
        label: 'Supervisor approved',
        type: 'icon',
        values: {
          false: 'times',
          true: 'check',
          null: 'minus-circle'
        }
      },
      read_only: true
    },
    {
      key: 'break_started_ended',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Break started ended',
        type: 'static'
      },
      read_only: true
    },
    {
      read_only: true,
      key: 'resend_sms_candidate',
      type: 'button',
      templateOptions: {
        action: 'emptyPost',
        label: '',
        type: 'button',
        text: 'Send TS SMS'
      },
      showIf: [
        {
          resend_sms_candidate: true
        }
      ]
    },
    {
      key: 'shift_started_ended',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Shift started ended',
        type: 'static'
      },
      read_only: true
    },
    {
      key: 'jobsite',
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
      read_only: true,
      key: 'resend_sms_supervisor',
      type: 'button',
      templateOptions: {
        action: 'emptyPost',
        label: '',
        type: 'button',
        text: 'Send Supervisor SMS'
      },
      showIf: [
        {
          resend_sms_supervisor: true
        }
      ]
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
      read_only: true,
      templateOptions: {
        label: 'Related sms',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'related_sms',
      many: true
    },
    {
      key: 'going_to_work_reply_sms',
      type: 'button',
      templateOptions: {
        action: 'editForm',
        label: '',
        type: 'button',
        text: 'Reply'
      },
      read_only: true
    },
    {
      key: 'job_offer.candidate_contact',
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
      read_only: true,
      key: 'id',
      type: 'button',
      templateOptions: {
        action: 'emptyPost',
        label: 'Morning check:',
        type: 'button',
        text: 'Confirm'
      },
      showIf: [
        {
          going_to_work_confirmation: null
        }
      ]
    },
    {
      key: 'position',
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
      key: 'myob_status',
      type: 'input',
      showIf: [
        {
          show_sync_button: false
        }
      ],
      templateOptions: {
        required: false,
        label: 'Myob status',
        type: 'text'
      },
      read_only: true
    },
    {
      key: 'supervisor',
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
      key: 'job',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: null,
        text: 'Job'
      },
      read_only: true
    },
    {
      key: 'going_to_work_sent_sms',
      type: 'button',
      templateOptions: {
        action: 'editForm',
        label: '',
        type: 'button',
        text: 'Candidate Going To Work'
      },
      read_only: true
    },
    {
      key: 'candidate_filled',
      type: 'checkbox',
      showIf: [
        {
          candidate_filled: true
        }
      ],
      templateOptions: {
        required: false,
        label: 'Candidate filled',
        type: 'icon',
        values: {
          false: 'times',
          true: 'check',
          null: 'minus-circle'
        }
      },
      read_only: true
    }
  ]
};

const supervisor = {
  fields: [
    {
      default: 'contact_pictures/default_picture.jpg',
      key: 'job_offer.candidate_contact.contact.picture',
      read_only: false,
      templateOptions: {
        required: false,
        file: false,
        label: 'Picture',
        max: 255,
        type: 'picture'
      },
      type: 'input'
    },
    {
      default: '2018-07-05T15:30:00+10:00',
      key: 'shift_ended_at',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Shift ended at',
        type: 'static',
        text: '{shift_ended_at__time}'
      },
      type: 'static'
    },
    {
      default: '2018-07-05T12:00:00+10:00',
      key: 'break_started_at',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Break',
        type: 'static',
        text: '{break_started_at__time} - {break_ended_at__time}'
      },
      type: 'static'
    },
    {
      key: 'job_offer.candidate_contact',
      templateOptions: { link: null, label: '', type: 'link', text: '' },
      type: 'link'
    },
    {
      key: 'position',
      read_only: true,
      templateOptions: { required: false, label: 'Position', type: 'static' },
      type: 'static'
    },
    {
      key: 'shift_started_at',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Shift date',
        type: 'static',
        text: '{shift_started_at__date}'
      },
      type: 'static'
    }
  ],
  list: {
    columns: [
      {
        name: 'job_offer.candidate_contact.contact.picture',
        sort_field: 'job_offer.candidate_contact.contact.picture',
        title: null,
        sort: true,
        content: [
          {
            file: false,
            type: 'picture',
            field: 'job_offer.candidate_contact.contact.picture'
          }
        ],
        label: 'Picture',
        delim: null
      },
      {
        name: 'position',
        content: [
          {
            endpoint:
              '/ecore/api/v2/candidate/candidatecontacts/{job_offer.candidate_contact.id}/',
            type: 'link',
            field: 'job_offer.candidate_contact'
          },
          { label: 'Position', type: 'static', field: 'position' }
        ],
        label: 'Position',
        title: null,
        delim: null
      },
      {
        name: 'times',
        content: [
          {
            text: '{shift_started_at__date}',
            label: 'Shift date',
            type: 'static',
            field: 'shift_started_at'
          },
          {
            text: '{shift_started_at__time}',
            label: 'Shift started at',
            type: 'static',
            field: 'shift_started_at'
          },
          {
            text: '{break_started_at__time} - {break_ended_at__time}',
            label: 'Break',
            type: 'static',
            field: 'break_started_at'
          },
          {
            text: '{shift_ended_at__time}',
            label: 'Shift ended at',
            type: 'static',
            field: 'shift_ended_at'
          }
        ],
        label: 'Times',
        title: null,
        delim: null
      }
    ],
    list: 'timesheet',
    editDisable: false,
    label: 'Timesheet Entry',
    pagination_label: 'Timesheet Entry',
    search_enabled: false
  }
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
    list: false,
    endpoint: '/ecore/api/v2/hr/joboffers/',
    read_only: false,
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
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Going to work sent sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'going_to_work_sent_sms',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Going to work reply sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'going_to_work_reply_sms',
    many: false
  },
  {
    key: 'going_to_work_confirmation',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Going to Work',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'shift_started_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Shift Started at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'break_started_at',
    default: '-',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Break Started at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'break_ended_at',
    default: '-',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Break Ended at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'shift_ended_at',
    default: '2018-07-04T15:30:00+10:00',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Shift Ended at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Supervisor',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'supervisor',
    many: false
  },
  {
    key: 'candidate_submitted_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Candidate Submitted at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'supervisor_approved_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Supervisor Approved at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skillbaserates/',
    read_only: true,
    templateOptions: {
      label: 'Candidate rate',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_rate',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Rate overrides approved by',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'rate_overrides_approved_by',
    many: false
  },
  {
    key: 'rate_overrides_approved_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Candidate and Client Rate Overrides Approved at',
      type: 'date'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Related sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'related_sms',
    many: true
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
    list: false,
    endpoint: '/ecore/api/v2/hr/joboffers/',
    read_only: false,
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
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Going to work sent sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'going_to_work_sent_sms',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Going to work reply sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'going_to_work_reply_sms',
    many: false
  },
  {
    key: 'going_to_work_confirmation',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Going to Work',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'shift_started_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Shift Started at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'break_started_at',
    default: '-',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Break Started at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'break_ended_at',
    default: '-',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Break Ended at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'shift_ended_at',
    default: '2018-07-04T15:30:00+10:00',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Shift Ended at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Supervisor',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'supervisor',
    many: false
  },
  {
    key: 'candidate_submitted_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Candidate Submitted at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'supervisor_approved_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Supervisor Approved at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skillbaserates/',
    read_only: true,
    templateOptions: {
      label: 'Candidate rate',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_rate',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Rate overrides approved by',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'rate_overrides_approved_by',
    many: false
  },
  {
    key: 'rate_overrides_approved_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Candidate and Client Rate Overrides Approved at',
      type: 'date'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/sms-interface/smsmessages/',
    read_only: true,
    templateOptions: {
      label: 'Related sms',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'related_sms',
    many: true
  }
];

export const metadata = {
  list,
  supervisor,
  form,
  formadd
};
