import {
  yesterdayFormatDate,
  todayFormatDate,
  tomorrowFormatDate
} from './utils';

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
            query: `shift_dates__shift_date_0=${yesterdayFormatDate}&shift_dates__shift_date_1=${yesterdayFormatDate}` //tslint:disable-line
          },
          {
            label: 'Today',
            query: `shift_dates__shift_date_0=${todayFormatDate}&shift_dates__shift_date_1=${todayFormatDate}` //tslint:disable-line
          },
          {
            label: 'Tomorrow',
            query: `shift_dates__shift_date_0=${tomorrowFormatDate}&shift_dates__shift_date_1=${tomorrowFormatDate}` //tslint:disable-line
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
          endpoint:
            '/ecore/api/v2/core/companycontacts/?master_company=current',
          key: 'id'
        },
        query: 'provider_representative'
      },
      {
        key: 'active_states',
        label: 'State',
        data: {
          value: ['name_after_activation', 'name_before_activation'],
          endpoint:
            '/ecore/api/v2/core/workflownodes/?company={company_settings.company}&content_type=hr.job', //tslint:disable-line
          key: 'number'
        },
        query: 'active_states',
        default: null,
        type: 'related'
      },
      {
        key: 'customer_company',
        label: 'Client',
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

const formset = {
  fields: [
    {
      key: 'is_fulfilled_today',
      read_only: true,
      templateOptions: {
        required: false,
        values: {
          0: 'times-circle',
          1: 'check-circle',
          2: 'exclamation-circle',
          3: 'minus-circle',
          null: 'minus-circle'
        },
        label: 'Is fulfilled today',
        type: 'icon',
        color: { 0: 'danger', 1: 'success', 2: 'warning' }
      },
      type: 'checkbox'
    },
    {
      key: 'active_states',
      read_only: true,
      templateOptions: {
        required: false,
        label: 'Active states',
        type: 'static'
      },
      type: 'static'
    },
    {
      key: '__str__',
      read_only: true,
      templateOptions: { required: false, label: 'Job', type: 'static' },
      type: 'static'
    },
    {
      key: 'id',
      templateOptions: {
        action: 'fillin',
        label: '',
        type: 'button',
        text: 'Fill in'
      },
      type: 'button'
    },
    {
      many: false,
      key: 'position',
      endpoint: '/ecore/api/v2/skills/skills/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Position',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      key: 'is_fulfilled',
      read_only: true,
      templateOptions: {
        required: false,
        values: {
          0: 'times-circle',
          1: 'check-circle',
          2: 'exclamation-circle',
          3: 'minus-circle',
          null: 'minus-circle'
        },
        label: 'Is fulfilled',
        type: 'icon',
        color: { 0: 'danger', 1: 'success', 2: 'warning' }
      },
      type: 'checkbox'
    },
    {
      default: '07:00:00',
      key: 'default_shift_starting_time',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Shift Starting Time',
        type: 'time'
      },
      type: 'datepicker'
    },
    {
      key: 'work_start_date',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Work Start Date',
        type: 'date'
      },
      type: 'datepicker'
    }
  ],
  list: {
    columns: [
      {
        name: '__str__',
        content: [{ type: 'static', field: '__str__' }],
        label: 'Job'
      },
      {
        name: 'position',
        sort: true,
        sort_field: 'position',
        content: [
          {
            endpoint: '/ecore/api/v2/skills/skills/',
            type: 'related',
            field: 'position'
          }
        ],
        label: 'Position'
      },
      {
        name: 'work_start_date',
        sort: true,
        sort_field: 'work_start_date',
        content: [{ type: 'datepicker', field: 'work_start_date' }],
        label: 'Work Start Date'
      },
      {
        name: 'shift_starting_time',
        content: [
          {
            label: 'Shift Starting Time',
            type: 'datepicker',
            field: 'default_shift_starting_time'
          }
        ],
        label: 'Shift Starting Time',
        title: null,
        delim: null
      },
      {
        name: 'fill_in',
        content: [
          {
            action: 'fillin',
            hidden: 'hide_fillin',
            icon: 'fa-sign-in',
            text: 'Fill in',
            type: 'button',
            field: 'id'
          }
        ],
        label: 'Fill in',
        title: null,
        delim: ' '
      },
      {
        name: 'fulfilled',
        content: [
          {
            color: { 0: 'danger', 1: 'success', 2: 'warning' },
            values: {
              0: 'times-circle',
              1: 'check-circle',
              2: 'exclamation-circle',
              3: 'minus-circle',
              null: 'minus-circle'
            },
            type: 'icon',
            field: 'is_fulfilled_today'
          },
          {
            color: { 0: 'danger', 1: 'success', 2: 'warning' },
            values: {
              0: 'times-circle',
              1: 'check-circle',
              2: 'exclamation-circle',
              3: 'minus-circle',
              null: 'minus-circle'
            },
            type: 'icon',
            field: 'is_fulfilled'
          }
        ],
        label: 'Fulfilled',
        title: 'today / next day',
        delim: '/'
      },
      {
        name: 'state',
        content: [{ type: 'static', field: 'active_states' }],
        label: 'State',
        title: null,
        delim: null
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/ecore/api/v2/hr/jobs/{id}',
            icon: 'fa-pencil',
            title: 'Edit',
            text_color: '#f0ad4e',
            type: 'button',
            field: 'id'
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
    buttons: [],
    list: 'job',
    editDisable: false,
    label: 'Job',
    pagination_label: 'Job',
    search_enabled: true
  }
};

const form = [
  {
    values: {
      status: {
        field: 'active_states'
      },
      job: 'position',
      jobsite: 'jobsite',
      tags: 'tags'
    },
    type: 'info',
    key: 'id'
  },
  {
    type: 'tabs',
    children: [
      {
        main: true,
        name: 'Job info',
        type: 'group',
        label: 'Job information',
        children: [
          {
            type: 'row',
            children: [
              {
                label: 'General',
                type: 'group',
                children: [
                  {
                    key: 'workers',
                    default: 1,
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Number Of workers',
                      max: 32767,
                      type: 'number',
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
                    key: 'hourly_rate_default',
                    type: 'input',
                    attributes: {
                      max: '{position.upper_rate_limit}',
                      min: '{position.lower_rate_limit}'
                    },
                    templateOptions: {
                      label: 'Candidate rate default',
                      type: 'number',
                      text: '${hourly_rate_default}/h'
                    }
                  }
                ],
                width: 0.33
              },
              {
                label: 'Client',
                type: 'group',
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
                    additional_text: 'Or',
                    default: '{jobsite.primary_contact.id}',
                    type: 'related',
                    query: {
                      jobsites: '{jobsite.id}'
                    }
                  },
                  {
                    key: 'provider_signed_at',
                    type: 'datepicker',
                    templateOptions: {
                      required: false,
                      label: 'Accepted at',
                      type: 'datetime'
                    },
                    read_only: true
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
                ],
                width: 0.33
              },
              {
                label: 'Provider',
                type: 'group',
                children: [
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
                  }
                ],
                width: 0.33
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
          job: '{id}',
          skill: '{position.id}',
          default_shift_starting_time: '{default_shift_starting_time}'
        },
        type: 'list',
        add_metadata_query: {
          fieldsets_type: 'job'
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
        name: 'Job states',
        type: 'group',
        children: [
          {
            key: 'timeline',
            type: 'timeline',
            query: {
              model: 'hr.job',
              object_id: ['{id.id}', '{id}']
            },
            templateOptions: {
              label: 'States Timeline',
              type: 'timeline',
              text: 'States Timeline'
            },
            endpoint: '/ecore/api/v2/core/workflownodes/timeline/'
          },
          {
            endpoint: '/ecore/api/v2/core/workflowobjects/',
            templateOptions: {
              label: 'States history',
              type: 'list',
              add_label: '+ Add item',
              text: 'States history'
            },
            collapsed: false,
            prefilled: {
              object_id: '{id}'
            },
            type: 'list',
            query: {
              model: 'hr.job',
              object_id: '{id}'
            },
            help: 'Here you can see changes job states'
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
          jobsite: '{jobsite.id}',
          company: '{customer_company.id}'
        },
        type: 'list',
        query: {
          job: '{id}'
        },
        help: 'Here you can see the favorite candidates for client'
      }
    ]
  },
  {
    endpoint: '/ecore/api/v2/core/tags/',
    key: 'tags',
    hide: true,
    useOptions: true,
    templateOptions: {
      label: 'Tags',
      values: ['__str__', 'id'],
      type: 'related'
    },
    type: 'related',
    many: true
  },
  {
    endpoint: '/ecore/api/v2/hr/jobsites/',
    read_only: false,
    key: 'jobsite',
    hide: true,
    templateOptions: {
      label: 'Jobsite',
      add: true,
      delete: false,
      values: ['primary_contact', '__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    query: {
      company: '{customer_company.id}',
      primary_contact: '{customer_representative.id}'
    }
  },
  {
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: true,
    key: 'position',
    hide: true,
    templateOptions: {
      label: 'Position',
      add: false,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    query: {
      job: '{id}'
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
            endpoint: '/ecore/api/v2/core/companies/',
            read_only: true,
            key: 'customer_company',
            templateOptions: {
              label: 'Client',
              add: true,
              delete: false,
              values: ['__str__', 'master_company', 'primary_contact'],
              type: 'related',
              edit: true
            },
            type: 'related'
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
            additional_text: 'Or',
            default: '{jobsite.primary_contact.id}',
            type: 'related',
            query: {
              jobsites: '{jobsite.id}'
            }
          },
          {
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
            type: 'related',
            query: {
              company: '{customer_company.id}',
              primary_contact: '{customer_representative.id}'
            }
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
            endpoint: '/ecore/api/v2/skills/skills/',
            read_only: true,
            key: 'position',
            templateOptions: {
              label: 'Position',
              add: false,
              delete: false,
              values: [
                '__str__',
                'upper_rate_limit',
                'lower_rate_limit',
                'default_rate'
              ],
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
              type: 'number',
              min: 1
            },
            read_only: false
          },
          {
            key: 'work_start_date',
            default: todayFormatDate,
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
            key: 'hourly_rate_default',
            type: 'input',
            attributes: {
              max: '{position.upper_rate_limit}',
              min: '{position.lower_rate_limit}'
            },
            templateOptions: {
              label: 'Candidate rate default',
              type: 'number',
              text: '${hourly_rate_default}/h'
            }
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
  }
];

export const metadata = {
  list,
  formset,
  form,
  formadd
};
