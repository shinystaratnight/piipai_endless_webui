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
        key: 'job_title',
        label: 'Job title',
        options: [
          {
            value: 'director',
            label: 'director'
          },
          {
            value: 'Site Technician',
            label: 'Site Technician'
          },
          {
            value: 'Big Boss',
            label: 'Big Boss'
          },
          {
            value: 'DPG - Mascot Warehouse',
            label: 'DPG - Mascot Warehouse'
          },
          {
            value: 'Fin & Admin Manager',
            label: 'Fin & Admin Manager'
          },
          {
            value: 'Receptionist',
            label: 'Receptionist'
          },
          {
            value: 'Events Coordinator',
            label: 'Events Coordinator'
          },
          {
            value: 'Lead Technician',
            label: 'Lead Technician'
          },
          {
            value: 'Construction Manager: North',
            label: 'Construction Manager: North'
          },
          {
            value: 'Site Contact',
            label: 'Site Contact'
          },
          {
            value: 'Operation manager',
            label: 'Operation manager'
          },
          {
            value: 'accounts',
            label: 'accounts'
          },
          {
            value: 'Supervisor',
            label: 'Supervisor'
          },
          {
            value: 'Intern',
            label: 'Intern'
          },
          {
            value: 'Allocator',
            label: 'Allocator'
          },
          {
            value: 'National Portfolio Manager',
            label: 'National Portfolio Manager'
          },
          {
            value: 'Site Engineer',
            label: 'Site Engineer'
          },
          {
            value: 'Site Manager (temporary)',
            label: 'Site Manager (temporary)'
          },
          {
            value: 'Recruiter Consultant',
            label: 'Recruiter Consultant'
          },
          {
            value: 'Assistant Accountant',
            label: 'Assistant Accountant'
          },
          {
            value: 'IT Admin',
            label: 'IT Admin'
          },
          {
            value: 'Reception',
            label: 'Reception'
          },
          {
            value: 'CFO, GM – Finance & Risk',
            label: 'CFO, GM – Finance & Risk'
          },
          {
            value: 'Director/ Operations Manager',
            label: 'Director/ Operations Manager'
          },
          {
            value: 'Software Developer',
            label: 'Software Developer'
          },
          {
            value: 'Warehouse Manager',
            label: 'Warehouse Manager'
          },
          {
            value: 'Senior Site Manager',
            label: 'Senior Site Manager'
          },
          {
            value: 'Project Engineer',
            label: 'Project Engineer'
          },
          {
            value: 'Primary Contact',
            label: 'Primary Contact'
          },
          {
            value: 'Operations Administrator',
            label: 'Operations Administrator'
          },
          {
            value: 'Admin',
            label: 'Admin'
          },
          {
            value: 'Head of floor Opperations',
            label: 'Head of floor Opperations'
          },
          {
            value: 'Sub-contractor',
            label: 'Sub-contractor'
          },
          {
            value: 'HR Coordinator',
            label: 'HR Coordinator'
          },
          {
            value: 'IT Consultant',
            label: 'IT Consultant'
          },
          {
            value: 'hello',
            label: 'hello'
          },
          {
            value: 'SIte Manager',
            label: 'SIte Manager'
          },
          {
            value: 'Contracts Director',
            label: 'Contracts Director'
          },
          {
            value: 'Portfolio Manager',
            label: 'Portfolio Manager'
          },
          {
            value: 'Site Supervisor',
            label: 'Site Supervisor'
          },
          {
            value: 'Recruiter agent',
            label: 'Recruiter agent'
          },
          {
            value: 'Traffic Manager',
            label: 'Traffic Manager'
          },
          {
            value: 'Business Development Manager',
            label: 'Business Development Manager'
          },
          {
            value: 'Accountant',
            label: 'Accountant'
          },
          {
            value: 'Contracts',
            label: 'Contracts'
          },
          {
            value: 'Event Producer',
            label: 'Event Producer'
          },
          {
            value: 'Office Administrator',
            label: 'Office Administrator'
          },
          {
            value: 'Business Manager',
            label: 'Business Manager'
          },
          {
            value: 'Senior Estimator',
            label: 'Senior Estimator'
          },
          {
            value: 'After Hours Recruiter',
            label: 'After Hours Recruiter'
          },
          {
            value: 'Django developer',
            label: 'Django developer'
          },
          {
            value: 'Administrator',
            label: 'Administrator'
          },
          {
            value: 'Accounts Officer',
            label: 'Accounts Officer'
          },
          {
            value: 'NSW Manager',
            label: 'NSW Manager'
          },
          {
            value: 'Recruitment Coordinator',
            label: 'Recruitment Coordinator'
          },
          {
            value: 'Front-end developer',
            label: 'Front-end developer'
          },
          {
            value: 'Construction Manager',
            label: 'Construction Manager'
          },
          {
            value: 'HR Administrator',
            label: 'HR Administrator'
          },
          {
            value: 'Construction Manager: Hunter',
            label: 'Construction Manager: Hunter'
          },
          {
            value: 'Directoer',
            label: 'Directoer'
          },
          {
            value: 'Site manager',
            label: 'Site manager'
          },
          {
            value: 'HR',
            label: 'HR'
          },
          {
            value: 'Construction Mnager',
            label: 'Construction Mnager'
          },
          {
            value: 'Developer - UI UX Designer',
            label: 'Developer - UI UX Designer'
          },
          {
            value: 'Admin and Logistics Manager',
            label: 'Admin and Logistics Manager'
          },
          {
            value: 'lol',
            label: 'lol'
          },
          {
            value: 'Manager',
            label: 'Manager'
          },
          {
            value: 'HR Intern',
            label: 'HR Intern'
          },
          {
            value: 'Site Manager',
            label: 'Site Manager'
          },
          {
            value: 'Leading Hand',
            label: 'Leading Hand'
          },
          {
            value: 'Estimator',
            label: 'Estimator'
          },
          {
            value: 'Project manager',
            label: 'Project manager'
          },
          {
            value: 'Financial Controller',
            label: 'Financial Controller'
          },
          {
            value: 'Administration',
            label: 'Administration'
          },
          {
            value: 'General Manager',
            label: 'General Manager'
          },
          {
            value: 'Director / Site Foreman',
            label: 'Director / Site Foreman'
          },
          {
            value: 'Recruitment Consultant',
            label: 'Recruitment Consultant'
          },
          {
            value: 'Site Manager (not at Reitsma)',
            label: 'Site Manager (not at Reitsma)'
          },
          {
            value: 'Construction Manager: Central',
            label: 'Construction Manager: Central'
          },
          {
            value: 'Contract Administrator',
            label: 'Contract Administrator'
          },
          {
            value: 'Managing Director',
            label: 'Managing Director'
          },
          {
            value: 'Ahaha',
            label: 'Ahaha'
          },
          {
            value: 'Django Developer',
            label: 'Django Developer'
          },
          {
            value: 'Safety Manager',
            label: 'Safety Manager'
          },
          {
            value: 'Building Cadet',
            label: 'Building Cadet'
          },
          {
            value: 'Project Coordinator',
            label: 'Project Coordinator'
          },
          {
            value: 'Office Manager',
            label: 'Office Manager'
          },
          {
            value: 'Operations Assistant',
            label: 'Operations Assistant'
          },
          {
            value: 'Recruitment Manager',
            label: 'Recruitment Manager'
          },
          {
            value: 'Accounts',
            label: 'Accounts'
          },
          {
            value: 'Accounts Manager',
            label: 'Accounts Manager'
          },
          {
            value: 'Director',
            label: 'Director'
          },
          {
            value: 'Intern Manager',
            label: 'Intern Manager'
          },
          {
            value: 'HR Co-Ordinator',
            label: 'HR Co-Ordinator'
          },
          {
            value: 'Project Manager',
            label: 'Project Manager'
          },
          {
            value: 'HR Manager',
            label: 'HR Manager'
          },
          {
            value: 'Director (no calls for labour)',
            label: 'Director (no calls for labour)'
          },
          {
            value: 'Event Manager',
            label: 'Event Manager'
          },
          {
            value: 'operator',
            label: 'operator'
          },
          {
            value: 'Chief Financial Officer',
            label: 'Chief Financial Officer'
          },
          {
            value: 'Site Foreman',
            label: 'Site Foreman'
          },
          {
            value: 'Foreman',
            label: 'Foreman'
          },
          {
            value: 'Marketing Intern',
            label: 'Marketing Intern'
          },
          {
            value: 'Production Manager',
            label: 'Production Manager'
          },
          {
            value: 'Accounts Intern',
            label: 'Accounts Intern'
          },
          {
            value: 'Site Manager - Lidcombe',
            label: 'Site Manager - Lidcombe'
          },
          {
            value: 'manager',
            label: 'manager'
          },
          {
            value: 'Operations Manager',
            label: 'Operations Manager'
          },
          {
            value: 'Maitenence',
            label: 'Maitenence'
          },
          {
            value: '',
            label: ''
          },
          {
            value: 'Contact Administrator',
            label: 'Contact Administrator'
          },
          {
            value: 'Company Director',
            label: 'Company Director'
          },
          {
            value: 'Project Supervisor',
            label: 'Project Supervisor'
          },
          {
            value: 'Contracts Manager',
            label: 'Contracts Manager'
          },
          {
            value: 'Contracts Administrator',
            label: 'Contracts Administrator'
          },
          {
            value: 'Contract Administration',
            label: 'Contract Administration'
          },
          {
            value: 'Allocation Officer',
            label: 'Allocation Officer'
          },
          {
            value: 'Construction Manager: South',
            label: 'Construction Manager: South'
          },
          {
            value: 'Lana',
            label: 'Lana'
          },
          {
            value: 'Operation Manager',
            label: 'Operation Manager'
          },
          {
            value: 'Recruitment agent',
            label: 'Recruitment agent'
          },
          {
            value: 'Allocation Manager',
            label: 'Allocation Manager'
          },
          {
            value: 'Construction Supervisor',
            label: 'Construction Supervisor'
          },
          {
            value: 'Accounts Payable',
            label: 'Accounts Payable'
          },
          {
            value: 'Site Forman',
            label: 'Site Forman'
          },
          {
            value: 'site manager',
            label: 'site manager'
          },
          {
            value: 'Project Administrator',
            label: 'Project Administrator'
          },
          {
            value: 'Senior Project Manager',
            label: 'Senior Project Manager'
          }
        ],
        query: 'job_title',
        default: null,
        type: 'select'
      },
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
      {
        key: 'manager',
        label: 'Manager',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companycontacts/?is_manager=3',
          key: 'id'
        },
        query: 'manager'
      }
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
      picture: 'contact.picture.thumb'
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
          object_id: '{id}'
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
