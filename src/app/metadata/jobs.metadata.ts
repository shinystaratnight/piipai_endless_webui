const list = {
  list: {
    list: 'job',
    label: 'Job',
    columns: [
      {
        content: [
          {
            field: 'workers',
            type: 'input'
          }
        ],
        name: 'workers',
        sort_field: 'workers',
        label: 'Workers',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/hr/jobsites/',
            field: 'jobsite',
            type: 'related'
          },
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            field: 'jobsite.primary_contact',
            type: 'related'
          },
          {
            field: 'jobsite.primary_contact.contact.phone_mobile',
            type: 'link',
            link: 'tel:{jobsite.primary_contact.contact.phone_mobile}'
          }
        ],
        name: 'jobsite',
        title: null,
        label: 'Jobsite',
        delim: null
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/skills/skills/',
            field: 'position',
            type: 'related'
          }
        ],
        name: 'position',
        sort_field: 'position',
        label: 'Position',
        sort: true
      },
      {
        content: [
          {
            values: {
              0: 'times-circle',
              1: 'check-circle',
              2: 'exclamation-circle',
              3: 'minus-circle',
              null: 'minus-circle'
            },
            field: 'is_fulfilled_today',
            type: 'icon',
            color: {
              0: 'danger',
              1: 'success',
              2: 'warning'
            }
          },
          {
            values: {
              0: 'times-circle',
              1: 'check-circle',
              2: 'exclamation-circle',
              3: 'minus-circle',
              null: 'minus-circle'
            },
            field: 'is_fulfilled',
            type: 'icon',
            color: {
              0: 'danger',
              1: 'success',
              2: 'warning'
            }
          }
        ],
        name: 'fulfilled',
        title: 'today / next day',
        label: 'Fulfilled',
        delim: '/'
      },
      {
        content: [
          {
            field: 'id',
            hidden: 'no_sds',
            icon: 'fa-times',
            action: 'editForm',
            type: 'button',
            text: 'Cancel Shift Dates'
          },
          {
            field: 'id',
            hidden: 'hide_fillin',
            icon: 'fa-sign-in',
            action: 'fillin',
            type: 'button',
            text: 'Fill-in'
          },
          {
            endpoint: '/ecore/api/v2/hr/jobs/{id}/extend',
            field: 'id',
            showIf: [
              {
                extend: true
              }
            ],
            icon: 'fa-sign-in',
            action: 'editForm',
            type: 'button',
            text: 'Extend'
          }
        ],
        name: 'actions',
        title: null,
        label: 'Actions',
        delim: null
      },
      {
        content: [
          {
            field: 'active_states',
            type: 'static'
          }
        ],
        name: 'state',
        title: null,
        label: 'State',
        delim: null
      },
      {
        content: [
          {
            field: 'title',
            type: 'static'
          }
        ],
        name: 'title',
        title: null,
        label: 'Title',
        delim: null
      },
      {
        delim: null,
        label: 'Created at',
        sort: true,
        content: [
          {
            field: 'created_at',
            type: 'datepicker',
            label: 'Created at'
          }
        ],
        name: 'created_at',
        title: null,
        sort_field: 'created_at'
      },
      {
        delim: null,
        label: 'Updated at',
        sort: true,
        content: [
          {
            field: 'updated_at',
            type: 'datepicker',
            label: 'Updated at'
          }
        ],
        name: 'updated_at',
        title: null,
        sort_field: 'updated_at'
      },
      {
        delim: null,
        label: 'Published',
        sort: true,
        content: [
          {
            field: 'published',
            type: 'checkbox',
            label: 'Published'
          }
        ],
        name: 'published',
        title: null,
        sort_field: 'published'
      },
      {
        delim: null,
        label: 'Publishing Date',
        sort: true,
        content: [
          {
            field: 'publish_on',
            type: 'datepicker',
            label: 'Publishing Date'
          }
        ],
        name: 'publish_on',
        title: null,
        sort_field: 'publish_on'
      },
      {
        delim: null,
        label: 'Expiration date',
        sort: true,
        content: [
          {
            field: 'expires_on',
            type: 'datepicker',
            label: 'Expiration date'
          }
        ],
        name: 'expires_on',
        title: null,
        sort_field: 'expires_on'
      }
    ],
    tabs: [
      {
        label: 'Details',
        is_collapsed: false,
        fields: ['fulfilled', 'actions', 'timesheets', 'activities', 'state']
      },
      {
        label: 'Other',
        is_collapsed: true,
        fields: [
          'title',
          'created_at',
          'updated_at',
          'published',
          'publish_on',
          'expires_on'
        ]
      }
    ],
    pagination_label: 'Job',
    search_enabled: true,
    editDisable: false,
    filters: [
      {
        list: [
          {
            label: 'Yesterday',
            query:
              'shift_dates__shift_date_0=2018-07-03&shift_dates__shift_date_1=2018-07-03'
          },
          {
            label: 'Today',
            query:
              'shift_dates__shift_date_0=2018-07-04&shift_dates__shift_date_1=2018-07-04'
          },
          {
            label: 'Tomorrow',
            query:
              'shift_dates__shift_date_0=2018-07-05&shift_dates__shift_date_1=2018-07-05'
          }
        ],
        key: 'shift_dates.shift_date',
        label: 'Shift start date',
        type: 'date',
        input: [
          {
            label: 'From date',
            query: 'shift_dates__shift_date_0'
          },
          {
            label: 'To date',
            query: 'shift_dates__shift_date_1'
          }
        ]
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
      },
      {
        key: 'position',
        label: 'Skill',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/skills/skills/',
          key: 'id'
        },
        query: 'position'
      },
      {
        key: 'provider_representative',
        label: 'Provider representative',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companycontacts/',
          key: 'id'
        },
        query: 'provider_representative'
      },
      {
        key: 'active_states',
        label: 'State',
        options: [
          {
            value: 10,
            label: 'New'
          },
          {
            value: 20,
            label: 'Confirmed'
          },
          {
            value: 30,
            label: 'Filled'
          },
          {
            value: 40,
            label: 'On-Hold'
          },
          {
            value: 50,
            label: 'Active'
          },
          {
            value: 60,
            label: 'Completed'
          }
        ],
        query: 'active_states',
        default: null,
        type: 'select'
      },
      {
        key: 'published',
        label: 'Published',
        options: [
          {
            value: 'True',
            label: 'True'
          },
          {
            value: 'False',
            label: 'False'
          }
        ],
        query: 'published',
        default: null,
        type: 'select'
      },
      {
        key: 'customer_company',
        label: 'Customer company',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companies/',
          key: 'id'
        },
        query: 'customer_company'
      }
    ]
  },
  fields: [
    {
      key: 'published',
      default: false,
      type: 'checkbox',
      templateOptions: {
        required: false,
        label: 'Published',
        type: 'checkbox'
      },
      read_only: true
    },
    {
      key: 'publish_on',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Publishing Date',
        type: 'date'
      },
      read_only: true
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/skills/skills/',
      read_only: true,
      templateOptions: {
        label: 'Position',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'position',
      many: false
    },
    {
      key: 'is_fulfilled_today',
      type: 'checkbox',
      templateOptions: {
        required: false,
        label: 'Is fulfilled today',
        type: 'icon',
        color: {
          0: 'danger',
          1: 'success',
          2: 'warning'
        },
        values: {
          0: 'times-circle',
          1: 'check-circle',
          2: 'exclamation-circle',
          3: 'minus-circle',
          null: 'minus-circle'
        }
      },
      read_only: true
    },
    {
      key: 'active_states',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Active states',
        type: 'static'
      },
      read_only: true
    },
    {
      key: 'title',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Title',
        type: 'static'
      },
      read_only: true
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/hr/jobsites/',
      read_only: true,
      templateOptions: {
        label: 'Jobsite',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'jobsite',
      many: false
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
      key: 'expires_on',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Expiration date',
        type: 'date'
      },
      read_only: true
    },
    {
      key: 'workers',
      default: 1,
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Workers',
        type: 'number',
        min: 1,
        max: 32767
      },
      read_only: true
    },
    {
      key: 'jobsite.primary_contact.contact.phone_mobile',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: 'tel:{field}',
        text: ''
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
      key: 'id',
      type: 'button',
      templateOptions: {
        action: 'editForm',
        label: '',
        type: 'button',
        text: 'Cancel Shift Dates'
      },
      read_only: true
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/core/companycontacts/',
      read_only: true,
      templateOptions: {
        label: 'Primary contact',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'jobsite.primary_contact',
      many: false
    },
    {
      key: 'is_fulfilled',
      type: 'checkbox',
      templateOptions: {
        required: false,
        label: 'Is fulfilled',
        type: 'icon',
        color: {
          0: 'danger',
          1: 'success',
          2: 'warning'
        },
        values: {
          0: 'times-circle',
          1: 'check-circle',
          2: 'exclamation-circle',
          3: 'minus-circle',
          null: 'minus-circle'
        }
      },
      read_only: true
    }
  ]
};

const form = [
  {
    label: '{jobsite.__str__} {position.__str__} {work_start_date}',
    type: 'row',
    children: [
      {
        type: 'column',
        children: [
          {
            list: false,
            endpoint: '/ecore/api/v2/core/companies/',
            read_only: true,
            key: 'customer_company',
            templateOptions: {
              label: 'Client',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            type: 'related',
            query: {
              fields: 'primary_contact'
            },
            many: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/core/companycontacts/',
            read_only: true,
            key: 'customer_representative',
            templateOptions: {
              label: 'Client representative',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            default: '{jobsite.primary_contact.id}',
            showIf: ['jobsite.id'],
            type: 'related',
            query: {
              jobsites: '{jobsite.id}'
            },
            many: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/core/companies/',
            read_only: true,
            key: 'provider_company',
            templateOptions: {
              label: 'Provider company',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            default: '{customer_company.master_company.id}',
            showIf: ['customer_company.id'],
            type: 'related',
            query: {
              regular_company: '{customer_company.id}',
              type: 'master'
            },
            many: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/core/companycontacts/',
            read_only: false,
            key: 'provider_representative',
            templateOptions: {
              label: 'Provider representative',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            default: '{customer_company.primary_contact.id}',
            showIf: ['provider_company.id'],
            type: 'related',
            query: {
              company: '{provider_company.id}'
            },
            many: false
          },
          {
            key: 'provider_signed_at',
            type: 'datepicker',
            showIf: ['provider_signed_at'],
            templateOptions: {
              required: false,
              label: 'Accepted at',
              type: 'datetime'
            },
            read_only: true
          }
        ]
      },
      {
        type: 'column',
        children: [
          {
            list: false,
            endpoint: '/ecore/api/v2/hr/jobsites/',
            read_only: false,
            key: 'jobsite',
            templateOptions: {
              label: 'Jobsite',
              add: true,
              delete: false,
              values: ['primary_contact', '__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            type: 'related',
            query: {
              company: '{customer_company.id}',
              primary_contact: '{customer_representative.id}'
            },
            many: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/skills/skills/',
            read_only: true,
            key: 'position',
            templateOptions: {
              label: 'Position',
              add: false,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            type: 'related',
            query: {
              company: '{customer_company.id}'
            },
            many: false
          },
          {
            key: 'workers',
            default: 1,
            type: 'input',
            templateOptions: {
              required: false,
              label: 'Number Of workers',
              max: 32767,
              type: 'text',
              min: 1
            },
            read_only: false
          },
          {
            key: 'work_start_date',
            default: '2018-07-04',
            type: 'datepicker',
            templateOptions: {
              required: false,
              label: 'Work Start Date',
              type: 'date'
            },
            read_only: false
          },
          {
            key: 'default_shift_starting_time',
            default: '07:00:00',
            type: 'datepicker',
            templateOptions: {
              required: false,
              label: 'Default Shift Starting Time',
              type: 'time'
            },
            read_only: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/skills/skillbaserates/',
            read_only: false,
            key: 'hourly_rate_default',
            templateOptions: {
              label: 'Candidate rate default',
              add: true,
              delete: false,
              values: ['hourly_rate'],
              type: 'related',
              edit: true,
              display: '${hourly_rate}/h'
            },
            collapsed: false,
            type: 'related',
            query: {
              skill: '{position.id}'
            },
            many: false
          },
          {
            key: 'notes',
            type: 'textarea',
            templateOptions: {
              required: false,
              label: 'Notes',
              type: 'textarea',
              description: 'Job Description/Instructions for candidate'
            },
            read_only: false
          }
        ]
      }
    ]
  },
  {
    endpoint: '/ecore/api/v2/hr/shifts/',
    metadata_query: {
      editable_type: 'job'
    },
    add_endpoint: '/ecore/api/v2/hr/shiftdates/',
    collapsed: false,
    edit_endpoint: '/ecore/api/v2/hr/shiftdates/{date.id}',
    templateOptions: {
      label: 'Shift Dates',
      type: 'list',
      add_label: 'Add',
      text: 'Shift Dates'
    },
    query: {
      job: '{id}'
    },
    prefilled: {
      job: '{id}'
    },
    type: 'list',
    add_metadata_query: {
      fieldsets_type: 'job'
    }
  },
  {
    endpoint: '/ecore/api/v2/hr/jobtags/',
    templateOptions: {
      label: 'Job Tags',
      type: 'list',
      add_label: 'Add',
      text: 'Job Tags'
    },
    collapsed: true,
    prefilled: {
      job: '{id}'
    },
    type: 'list',
    query: {
      job: '{id}'
    }
  },
  {
    endpoint: '/ecore/api/v2/hr/joboffers/',
    add_endpoint: '/ecore/api/v2/hr/jobs/{id}/fillin/',
    templateOptions: {
      label: 'Job Offers',
      type: 'list',
      add_label: 'Fill in',
      text: 'Job Offers'
    },
    collapsed: false,
    type: 'list',
    query: {
      job: '{id}'
    },
    add_metadata_query: {
      type: 'list'
    }
  },
  {
    label: 'Job state timeline',
    type: 'row',
    children: [
      {
        key: 'timeline',
        type: 'timeline',
        query: {
          model: 'hr.job',
          object_id: '{id}'
        },
        templateOptions: {
          label: 'States Timeline',
          type: 'timeline',
          text: 'States Timeline'
        },
        endpoint: '/ecore/api/v2/core/workflownodes/timeline/'
      }
    ]
  },
  {
    endpoint: '/ecore/api/v2/hr/favouritelists/',
    metadata_query: {
      editable_type: 'job'
    },
    templateOptions: {
      label: 'Favourite List',
      type: 'list',
      add_label: 'Add',
      text: 'Favourite List'
    },
    collapsed: false,
    prefilled: {
      job: '{id}',
      company_contact: '{customer_representative.id}'
    },
    type: 'list',
    query: {
      company_contact: '{customer_representative.id}'
    }
  }
];

const formadd = [
  {
    label: '{jobsite.__str__} {position.__str__} {work_start_date}',
    type: 'row',
    children: [
      {
        type: 'column',
        children: [
          {
            list: false,
            endpoint: '/ecore/api/v2/core/companies/',
            read_only: true,
            key: 'customer_company',
            templateOptions: {
              label: 'Client',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            type: 'related',
            query: {
              fields: 'primary_contact'
            },
            many: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/core/companycontacts/',
            read_only: true,
            key: 'customer_representative',
            templateOptions: {
              label: 'Client representative',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            default: '{jobsite.primary_contact.id}',
            showIf: ['jobsite.id'],
            type: 'related',
            query: {
              jobsites: '{jobsite.id}'
            },
            many: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/core/companies/',
            read_only: true,
            key: 'provider_company',
            templateOptions: {
              label: 'Provider company',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            default: '{customer_company.master_company.id}',
            showIf: ['customer_company.id'],
            type: 'related',
            query: {
              regular_company: '{customer_company.id}',
              type: 'master'
            },
            many: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/core/companycontacts/',
            read_only: false,
            key: 'provider_representative',
            templateOptions: {
              label: 'Provider representative',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            default: '{customer_company.primary_contact.id}',
            showIf: ['provider_company.id'],
            type: 'related',
            query: {
              company: '{provider_company.id}'
            },
            many: false
          },
          {
            key: 'provider_signed_at',
            type: 'datepicker',
            showIf: ['provider_signed_at'],
            templateOptions: {
              required: false,
              label: 'Accepted at',
              type: 'datetime'
            },
            read_only: true
          }
        ]
      },
      {
        type: 'column',
        children: [
          {
            list: false,
            endpoint: '/ecore/api/v2/hr/jobsites/',
            read_only: false,
            key: 'jobsite',
            templateOptions: {
              label: 'Jobsite',
              add: true,
              delete: false,
              values: ['primary_contact', '__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            type: 'related',
            query: {
              company: '{customer_company.id}',
              primary_contact: '{customer_representative.id}'
            },
            many: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/skills/skills/',
            read_only: true,
            key: 'position',
            templateOptions: {
              label: 'Position',
              add: false,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            type: 'related',
            query: {
              company: '{customer_company.id}'
            },
            many: false
          },
          {
            key: 'workers',
            default: 1,
            type: 'input',
            templateOptions: {
              required: false,
              label: 'Number Of workers',
              max: 32767,
              type: 'text',
              min: 1
            },
            read_only: false
          },
          {
            key: 'work_start_date',
            default: '2018-07-04',
            type: 'datepicker',
            templateOptions: {
              required: false,
              label: 'Work Start Date',
              type: 'date'
            },
            read_only: false
          },
          {
            key: 'default_shift_starting_time',
            default: '07:00:00',
            type: 'datepicker',
            templateOptions: {
              required: false,
              label: 'Default Shift Starting Time',
              type: 'time'
            },
            read_only: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/skills/skillbaserates/',
            read_only: false,
            key: 'hourly_rate_default',
            templateOptions: {
              label: 'Candidate rate default',
              add: true,
              delete: false,
              values: ['hourly_rate'],
              type: 'related',
              edit: true,
              display: '${hourly_rate}/h'
            },
            collapsed: false,
            type: 'related',
            query: {
              skill: '{position.id}'
            },
            many: false
          },
          {
            key: 'notes',
            type: 'textarea',
            templateOptions: {
              required: false,
              label: 'Notes',
              type: 'textarea',
              description: 'Job Description/Instructions for candidate'
            },
            read_only: false
          }
        ]
      }
    ]
  },
  {
    endpoint: '/ecore/api/v2/hr/shifts/',
    metadata_query: {
      editable_type: 'job'
    },
    add_endpoint: '/ecore/api/v2/hr/shiftdates/',
    collapsed: false,
    edit_endpoint: '/ecore/api/v2/hr/shiftdates/{date.id}',
    templateOptions: {
      label: 'Shift Dates',
      type: 'list',
      add_label: 'Add',
      text: 'Shift Dates'
    },
    query: {
      job: '{id}'
    },
    prefilled: {
      job: '{id}'
    },
    type: 'list',
    add_metadata_query: {
      fieldsets_type: 'job'
    }
  },
  {
    endpoint: '/ecore/api/v2/hr/jobtags/',
    templateOptions: {
      label: 'Job Tags',
      type: 'list',
      add_label: 'Add',
      text: 'Job Tags'
    },
    collapsed: true,
    prefilled: {
      job: '{id}'
    },
    type: 'list',
    query: {
      job: '{id}'
    }
  },
  {
    endpoint: '/ecore/api/v2/hr/joboffers/',
    add_endpoint: '/ecore/api/v2/hr/jobs/{id}/fillin/',
    templateOptions: {
      label: 'Job Offers',
      type: 'list',
      add_label: 'Fill in',
      text: 'Job Offers'
    },
    collapsed: false,
    type: 'list',
    query: {
      job: '{id}'
    },
    add_metadata_query: {
      type: 'list'
    }
  },
  {
    label: 'Job state timeline',
    type: 'row',
    children: [
      {
        key: 'timeline',
        type: 'timeline',
        query: {
          model: 'hr.job',
          object_id: '{id}'
        },
        templateOptions: {
          label: 'States Timeline',
          type: 'timeline',
          text: 'States Timeline'
        },
        endpoint: '/ecore/api/v2/core/workflownodes/timeline/'
      }
    ]
  },
  {
    endpoint: '/ecore/api/v2/hr/favouritelists/',
    metadata_query: {
      editable_type: 'job'
    },
    templateOptions: {
      label: 'Favourite List',
      type: 'list',
      add_label: 'Add',
      text: 'Favourite List'
    },
    collapsed: false,
    prefilled: {
      job: '{id}',
      company_contact: '{customer_representative.id}'
    },
    type: 'list',
    query: {
      company_contact: '{customer_representative.id}'
    }
  }
];

export const metadata = {
  list,
  form,
  formadd
};
