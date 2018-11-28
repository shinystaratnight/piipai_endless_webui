const list = {
  list: {
    list: 'joboffer',
    search_enabled: false,
    pagination_label: 'Job Offer',
    buttons: [],
    columns: [
      {
        label: 'Times',
        delim: null,
        name: 'times',
        title: null,
        content: [
          {
            text: '{shift.date.shift_date__date}',
            type: 'static',
            label: 'Shift date',
            field: 'shift.date.shift_date'
          },
          { type: 'static', label: 'Shift Time', field: 'shift.time' }
        ]
      },
      {
        sort: true,
        sort_field: 'shift.date.job.position',
        label: 'Position',
        name: 'shift.date.job.position',
        content: [
          {
            endpoint: '/skills/skills/',
            type: 'related',
            field: 'shift.date.job.position'
          }
        ]
      },
      {
        label: 'Client',
        delim: null,
        name: 'client',
        title: null,
        content: [
          {
            endpoint: '/core/companies/',
            type: 'related',
            label: 'Client',
            field: 'shift.date.job.customer_company'
          }
        ]
      },
      {
        label: 'Job Site - Map',
        delim: ' ',
        name: 'job_site_-_map',
        title: null,
        content: [
          { type: 'related', field: 'jobsite_address' },
          {
            text_color: '#006ce5',
            icon: 'fa-map-marker',
            type: 'button',
            fields: [
              { type: 'static', field: 'latitude' },
              { type: 'static', field: 'longitude' }
            ],
            title: 'Open Map',
            action: 'openMap'
          }
        ]
      },
      {
        label: 'Job Site Contact',
        delim: null,
        name: 'job_site_contact',
        title: null,
        content: [
          {
            endpoint: '/core/companycontacts/',
            type: 'related',
            label: 'Job Site Contact',
            field: 'shift.date.job.jobsite.primary_contact'
          }
        ]
      },
      {
        sort: true,
        sort_field: 'shift.date.job.notes',
        label: 'Notes',
        name: 'shift.date.job.notes',
        content: [{ type: 'input', field: 'shift.date.job.notes' }]
      },
      {
        label: 'Status',
        delim: null,
        name: 'status',
        title: null,
        content: [
          {
            text: 'Accept',
            icon: 'fa-check-circle',
            type: 'button',
            color: 'success',
            endpoint: '/hr/joboffers/{id}/accept',
            field: 'hide_buttons',
            action: 'emptyPost',
            hidden: 'hide_buttons'
          },
          {
            text: 'Decline',
            icon: 'fa-times-circle',
            type: 'button',
            color: 'danger',
            endpoint: '/hr/joboffers/{id}/cancel',
            field: 'hide_buttons',
            action: 'emptyPost',
            hidden: 'hide_buttons'
          },
          {
            showIf: ['hide_buttons'],
            type: 'icon',
            field: 'status_icon',
            values: { false: 'times', true: 'check', null: 'minus-circle' }
          },
          { showIf: ['hide_buttons'], type: 'text', field: 'status' }
        ]
      }
    ],
    editDisable: true,
    label: 'Job Offer'
  },
  fields: [
    {
      key: 'shift.date.job.notes',
      type: 'input',
      templateOptions: {
        label: 'Notes',
        description: 'Job Description/Instructions for candidate',
        type: 'text',
        required: false
      },
      read_only: true
    },
    {
      list: false,
      many: false,
      collapsed: false,
      read_only: true,
      key: 'jobsite_address',
      endpoint: null,
      type: 'related',
      templateOptions: {
        edit: true,
        label: 'Jobsite address',
        add: true,
        type: 'related',
        delete: false,
        values: ['__str__']
      }
    },
    {
      key: 'status_icon',
      showIf: ['hide_buttons'],
      type: 'checkbox',
      templateOptions: {
        type: 'icon',
        required: false,
        label: 'Status icon',
        values: { false: 'times', true: 'check', null: 'minus-circle' }
      },
      read_only: true
    },
    {
      key: 'shift.time',
      type: 'static',
      templateOptions: { type: 'static', required: true, label: 'Shift Time' },
      read_only: true
    },
    {
      list: false,
      many: false,
      collapsed: false,
      read_only: true,
      key: 'shift.date.job.jobsite.primary_contact',
      endpoint: '/core/companycontacts/',
      type: 'related',
      templateOptions: {
        edit: true,
        label: 'Job Site Contact',
        add: true,
        type: 'related',
        delete: false,
        values: ['__str__']
      }
    },
    {
      key: 'status',
      showIf: ['hide_buttons'],
      type: 'input',
      templateOptions: { type: 'text', required: false, label: 'Status' },
      read_only: true
    },
    {
      key: 'shift.date.shift_date',
      type: 'static',
      templateOptions: {
        text: '{shift.date.shift_date__date}',
        required: true,
        type: 'static',
        label: 'Shift date'
      },
      read_only: true
    },
    {
      key: 'longitude',
      type: 'static',
      templateOptions: { type: 'static', required: false, label: 'Longitude' },
      read_only: true
    },
    {
      key: 'latitude',
      type: 'static',
      templateOptions: { type: 'static', required: false, label: 'Latitude' },
      read_only: true
    },
    {
      key: 'hide_buttons',
      type: 'button',
      templateOptions: {
        text: 'Accept',
        label: '',
        action: 'emptyPost',
        type: 'button'
      },
      read_only: true
    },
    {
      list: false,
      many: false,
      collapsed: false,
      read_only: true,
      key: 'shift.date.job.customer_company',
      endpoint: '/core/companies/',
      type: 'related',
      templateOptions: {
        edit: true,
        label: 'Client',
        add: true,
        type: 'related',
        delete: false,
        values: ['__str__']
      }
    },
    {
      list: false,
      many: false,
      collapsed: false,
      read_only: true,
      key: 'shift.date.job.position',
      endpoint: '/skills/skills/',
      type: 'related',
      templateOptions: {
        edit: true,
        label: 'Position',
        add: true,
        type: 'related',
        delete: false,
        values: ['__str__']
      }
    }
  ]
};

const form = [
  {
    key: 'id',
    hide: true,
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      label: 'Id'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Updated at'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Created at'
    },
    read_only: true
  },
  {
    key: 'shift.id',
    hide: true,
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      label: 'Id'
    },
    read_only: false
  },
  {
    key: 'shift.time',
    type: 'datepicker',
    templateOptions: {
      type: 'time',
      required: true,
      label: 'Time'
    },
    read_only: false
  },
  {
    key: 'shift.date.shift_date',
    type: 'datepicker',
    templateOptions: {
      type: 'date',
      required: true,
      label: 'Shift date'
    },
    read_only: false
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.position',
    endpoint: '/skills/skills/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Position',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.customer_company',
    endpoint: '/core/companies/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Customer company',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    key: 'shift.date.job.notes',
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      description: 'Job Description/Instructions for candidate',
      label: 'Notes'
    },
    read_only: false
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.jobsite.primary_contact',
    endpoint: '/core/companycontacts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Primary contact',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date.job.jobsite',
    endpoint: '/hr/jobsites/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Jobsite',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date.job',
    endpoint: '/hr/jobs/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Job',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date',
    endpoint: '/hr/shiftdates/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Date',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift',
    endpoint: '/hr/shifts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Shift',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'candidate_contact',
    endpoint: '/candidate/candidatecontacts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Candidate contact',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'offer_sent_by_sms',
    endpoint: '/sms-interface/smsmessages/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Offer sent by sms',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'reply_received_by_sms',
    endpoint: '/sms-interface/smsmessages/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Reply received by sms',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    key: 'status',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Status'
    },
    read_only: true
  },
  {
    key: 'scheduled_sms_datetime',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Scheduled date'
    },
    read_only: false
  },
  {
    key: 'jobsite_address',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Jobsite address'
    },
    read_only: true
  },
  {
    key: 'shift.id',
    hide: true,
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      label: 'Id'
    },
    read_only: false
  },
  {
    key: 'shift.time',
    type: 'datepicker',
    templateOptions: {
      type: 'time',
      required: true,
      label: 'Time'
    },
    read_only: false
  },
  {
    key: 'shift.date.shift_date',
    type: 'datepicker',
    templateOptions: {
      type: 'date',
      required: true,
      label: 'Shift date'
    },
    read_only: false
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.position',
    endpoint: '/skills/skills/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Position',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.customer_company',
    endpoint: '/core/companies/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Customer company',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    key: 'shift.date.job.notes',
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      description: 'Job Description/Instructions for candidate',
      label: 'Notes'
    },
    read_only: false
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.jobsite.primary_contact',
    endpoint: '/core/companycontacts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Primary contact',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date.job.jobsite',
    endpoint: '/hr/jobsites/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Jobsite',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date.job',
    endpoint: '/hr/jobs/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Job',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date',
    endpoint: '/hr/shiftdates/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Date',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift',
    endpoint: '/hr/shifts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Shift',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    key: 'jobsite_address',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Jobsite address'
    },
    read_only: true
  },
  {
    key: 'hide_buttons',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Hide buttons'
    },
    read_only: true
  },
  {
    key: 'status',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Status'
    },
    read_only: true
  },
  {
    key: 'status_icon',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Status icon'
    },
    read_only: true
  },
  {
    key: 'hide_text',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Hide text'
    },
    read_only: true
  },
  {
    key: 'latitude',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Latitude'
    },
    read_only: true
  },
  {
    key: 'longitude',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Longitude'
    },
    read_only: true
  }
];

const formadd = [
  {
    key: 'id',
    hide: true,
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      label: 'Id'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Updated at'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Created at'
    },
    read_only: true
  },
  {
    key: 'shift.id',
    hide: true,
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      label: 'Id'
    },
    read_only: false
  },
  {
    key: 'shift.time',
    type: 'datepicker',
    templateOptions: {
      type: 'time',
      required: true,
      label: 'Time'
    },
    read_only: false
  },
  {
    key: 'shift.date.shift_date',
    type: 'datepicker',
    templateOptions: {
      type: 'date',
      required: true,
      label: 'Shift date'
    },
    read_only: false
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.position',
    endpoint: '/skills/skills/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Position',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.customer_company',
    endpoint: '/core/companies/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Customer company',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    key: 'shift.date.job.notes',
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      description: 'Job Description/Instructions for candidate',
      label: 'Notes'
    },
    read_only: false
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.jobsite.primary_contact',
    endpoint: '/core/companycontacts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Primary contact',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date.job.jobsite',
    endpoint: '/hr/jobsites/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Jobsite',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date.job',
    endpoint: '/hr/jobs/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Job',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date',
    endpoint: '/hr/shiftdates/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Date',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift',
    endpoint: '/hr/shifts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Shift',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'candidate_contact',
    endpoint: '/candidate/candidatecontacts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Candidate contact',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'offer_sent_by_sms',
    endpoint: '/sms-interface/smsmessages/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Offer sent by sms',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'reply_received_by_sms',
    endpoint: '/sms-interface/smsmessages/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Reply received by sms',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    key: 'status',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Status'
    },
    read_only: true
  },
  {
    key: 'scheduled_sms_datetime',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Scheduled date'
    },
    read_only: false
  },
  {
    key: 'jobsite_address',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Jobsite address'
    },
    read_only: true
  },
  {
    key: 'shift.id',
    hide: true,
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      label: 'Id'
    },
    read_only: false
  },
  {
    key: 'shift.time',
    type: 'datepicker',
    templateOptions: {
      type: 'time',
      required: true,
      label: 'Time'
    },
    read_only: false
  },
  {
    key: 'shift.date.shift_date',
    type: 'datepicker',
    templateOptions: {
      type: 'date',
      required: true,
      label: 'Shift date'
    },
    read_only: false
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.position',
    endpoint: '/skills/skills/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Position',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.customer_company',
    endpoint: '/core/companies/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Customer company',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    key: 'shift.date.job.notes',
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      description: 'Job Description/Instructions for candidate',
      label: 'Notes'
    },
    read_only: false
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: true,
    key: 'shift.date.job.jobsite.primary_contact',
    endpoint: '/core/companycontacts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Primary contact',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date.job.jobsite',
    endpoint: '/hr/jobsites/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Jobsite',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date.job',
    endpoint: '/hr/jobs/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Job',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift.date',
    endpoint: '/hr/shiftdates/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Date',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    list: false,
    many: false,
    collapsed: false,
    read_only: false,
    key: 'shift',
    endpoint: '/hr/shifts/',
    type: 'related',
    templateOptions: {
      edit: true,
      label: 'Shift',
      add: true,
      type: 'related',
      delete: false,
      values: ['__str__']
    }
  },
  {
    key: 'jobsite_address',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Jobsite address'
    },
    read_only: true
  },
  {
    key: 'hide_buttons',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Hide buttons'
    },
    read_only: true
  },
  {
    key: 'status',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Status'
    },
    read_only: true
  },
  {
    key: 'status_icon',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Status icon'
    },
    read_only: true
  },
  {
    key: 'hide_text',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Hide text'
    },
    read_only: true
  },
  {
    key: 'latitude',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Latitude'
    },
    read_only: true
  },
  {
    key: 'longitude',
    type: 'static',
    templateOptions: {
      type: 'static',
      required: false,
      label: 'Longitude'
    },
    read_only: true
  }
];

export const metadata = {
  list,
  form,
  formadd
};
