const list = {
  list: {
    list: 'companycontact',
    label: 'Client Contact',
    pagination_label: 'Client Contacts',
    columns: [
      {
        content: [
          {
            field: 'job_title',
            type: 'input'
          }
        ],
        name: 'job_title',
        sort_field: 'job_title',
        label: 'Job title',
        sort: true
      },
      {
        content: [
          {
            values: {
              'Mr.': 'Mr.',
              'Ms.': 'Ms.',
              'Mrs.': 'Mrs.',
              'Dr.': 'Dr.'
            },
            field: 'contact.title',
            type: 'select'
          }
        ],
        name: 'contact.title',
        sort_field: 'contact.title',
        label: 'Title',
        sort: true
      },
      {
        content: [
          {
            field: 'contact.first_name',
            type: 'input'
          }
        ],
        name: 'contact.first_name',
        sort_field: 'contact.first_name',
        label: 'First Name',
        sort: true
      },
      {
        content: [
          {
            field: 'contact.last_name',
            type: 'input'
          }
        ],
        name: 'contact.last_name',
        sort_field: 'contact.last_name',
        label: 'Last Name',
        sort: true
      },
      {
        content: [
          {
            field: 'contact.phone_mobile',
            type: 'link',
            link: 'tel:{contact.phone_mobile}'
          },
          {
            icon: 'fa-commenting',
            action: 'sendSMS',
            fields: [
              {
                field: 'contact.phone_mobile',
                type: 'link'
              }
            ],
            type: 'button',
            text: 'SMS'
          }
        ],
        name: 'mobile_phone',
        title: null,
        label: 'Mobile Phone',
        delim: null
      },
      {
        content: [
          {
            field: 'contact.email',
            type: 'input'
          }
        ],
        name: 'contact.email',
        sort_field: 'contact.email',
        label: 'E-mail',
        sort: true
      },
      {
        content: [
          {
            field: 'receive_job_confirmation_sms',
            type: 'checkbox'
          }
        ],
        name: 'receive_job_confirmation_sms',
        sort_field: 'receive_job_confirmation_sms',
        label: 'Receive Job confirmation sms',
        sort: true
      }
    ],
    filters: [
      {
        key: 'company',
        label: 'Company',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companies/',
          key: 'id'
        },
        query: 'company'
      },
    ],
    search_enabled: true,
    editDisable: false,
    actions: {
      options: [
        {
          endpoint: '/ecore/api/v2/core/companycontacts/sendsms/',
          label: 'Send sms',
          confirm: false,
          message: 'Are you sure?'
        }
      ],
      label: 'Actions',
      agree_label: 'Agree',
      button_label: 'Go',
      decline_label: 'Decline'
    }
  },
  fields: [
    {
      key: 'job_title',
      type: 'input',
      templateOptions: {
        required: true,
        label: 'Job title',
        type: 'text',
        max: 31
      },
      read_only: true
    },
    {
      key: 'contact.first_name',
      type: 'input',
      templateOptions: {
        required: true,
        label: 'First Name',
        type: 'text',
        max: 255
      },
      read_only: true
    },
    {
      key: 'contact.email',
      type: 'input',
      templateOptions: {
        required: true,
        label: 'E-mail',
        type: 'email',
        max: 255
      },
      read_only: true
    },
    {
      key: 'receive_job_confirmation_sms',
      default: true,
      type: 'checkbox',
      templateOptions: {
        required: false,
        label: 'Receive Job confirmation sms',
        type: 'checkbox'
      },
      read_only: true
    },
    {
      key: 'contact.last_name',
      type: 'input',
      templateOptions: {
        required: true,
        label: 'Last Name',
        type: 'text',
        max: 255
      },
      read_only: true
    },
    {
      key: 'contact.phone_mobile',
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
      key: 'contact.title',
      type: 'select',
      templateOptions: {
        required: false,
        label: 'Title',
        options: [
          {
            value: 'Mr.',
            label: 'Mr.'
          },
          {
            value: 'Ms.',
            label: 'Ms.'
          },
          {
            value: 'Mrs.',
            label: 'Mrs.'
          },
          {
            value: 'Dr.',
            label: 'Dr.'
          }
        ],
        type: 'select'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    values: {
      company: 'company.__str__',
      job_title: 'job_title',
      created_at: 'created_at',
      available: 'active',
      title: 'contact.__str__',
      updated_at: 'updated_at',
      picture: 'contact.picture.origin'
    },
    type: 'info',
    key: 'id'
  },
  {
    type: 'tabs',
    children: [
      {
        main: true,
        name: 'General Info',
        type: 'group',
        label: 'General information',
        children: [
          {
            type: 'row',
            children: [
              {
                type: 'group',
                children: [
                  {
                    key: 'rating_unreliable',
                    default: false,
                    type: 'checkbox',
                    templateOptions: {
                      required: false,
                      label: 'Rating ureliable',
                      type: 'checkbox',
                      description:
                        'Mark when rates Candidates badly but wants them again on the jobsite'
                    },
                    read_only: false
                  },
                  {
                    key: 'receive_job_confirmation_sms',
                    default: false,
                    type: 'checkbox',
                    templateOptions: {
                      required: false,
                      label: 'Receive Job confirmation SMS',
                      type: 'checkbox'
                    },
                    read_only: false
                  },
                  {
                    key: 'active',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Active',
                      type: 'checkbox'
                    },
                    hide: true,
                    default: false,
                    type: 'checkbox'
                  },
                  {
                    key: 'termination_date',
                    type: 'datepicker',
                    templateOptions: {
                      required: false,
                      label: 'Termination date',
                      type: 'date'
                    },
                    read_only: false
                  },
                  {
                    key: 'job_title',
                    type: 'input',
                    hide: true,
                    templateOptions: {
                      required: true,
                      label: 'Job title',
                      max: 31,
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/contacts/',
                    read_only: true,
                    hide: true,
                    templateOptions: {
                      label: 'Contact',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    key: 'contact',
                    many: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/companies/',
                    read_only: true,
                    hide: true,
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
                  }
                ],
                width: 0.5
              },
              {
                label: 'Contacts',
                type: 'group',
                children: [
                  {
                    key: 'contact.email',
                    send: false,
                    type: 'input',
                    templateOptions: {
                      required: true,
                      label: 'E-mail',
                      max: 255,
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    key: 'contact.phone_mobile',
                    send: false,
                    type: 'input',
                    templateOptions: {
                      required: true,
                      label: 'Phone number',
                      type: 'text'
                    },
                    read_only: true
                  }
                ],
                width: 0.5
              }
            ]
          }
        ]
      },
      {
        endpoint: '/ecore/api/v2/hr/jobsites/',
        templateOptions: {
          label: 'Jobsites',
          type: 'list',
          add_label: 'Add',
          text: 'Jobsites'
        },
        collapsed: false,
        prefilled: {
          regular_company: '{company.id}',
          primary_contact: '{id}'
        },
        type: 'list',
        query: {
          primary_contact: '{id}'
        }
      },
      {
        endpoint: '/ecore/api/v2/hr/jobs/',
        templateOptions: {
          label: 'Jobs',
          type: 'list',
          add_label: 'Add',
          text: 'Jobs'
        },
        collapsed: false,
        prefilled: {
          customer_company: '{company.id}',
          customer_representative: '{id}'
        },
        type: 'list',
        query: {
          customer_representative: '{id}'
        }
      },
      {
        endpoint: '/ecore/api/v2/hr/timesheets/',
        metadata_query: {
          editable_type: 'supervisor'
        },
        templateOptions: {
          label: 'Timesheets',
          type: 'list',
          text: 'Timesheets'
        },
        collapsed: false,
        type: 'list',
        query: {
          supervisor: '{id}'
        }
      },
      {
        endpoint: '/ecore/api/v2/core/notes/',
        templateOptions: {
          label: 'Notes',
          type: 'list',
          add_label: 'Add',
          text: 'Notes'
        },
        collapsed: false,
        prefilled: {
          object_id: '{id}',
          content_type: '{model_content_type}',
        },
        type: 'list',
        query: {
          object_id: '{id}'
        }
      }
    ]
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companies/',
    read_only: false,
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
    key: 'company',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/contacts/',
    checkObject: {
      endpoint: '/ecore/api/v2/core/companycontactrelationships/',
      error: 'This client contact already exists!',
      query: {
        contact: '{contact.id}',
        active: true,
        company: '{company.id}'
      }
    },
    read_only: false,
    templateOptions: {
      label: 'Contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    showIf: ['company.id'],
    type: 'related',
    key: 'contact',
    many: false
  },
  {
    key: 'job_title',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Job title',
      max: 31,
      type: 'text'
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
