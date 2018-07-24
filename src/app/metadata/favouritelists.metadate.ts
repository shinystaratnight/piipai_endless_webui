const list = {
  list: {
    list: 'favouritelist',
    label: 'Favourite list',
    columns: [
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            field: 'company_contact',
            type: 'related'
          }
        ],
        name: 'company_contact',
        sort_field: 'company_contact',
        label: 'Recruitment Agent',
        sort: true
      },
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
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            field: 'company.manager',
            type: 'related',
            label: 'Company Manager'
          }
        ],
        name: 'company_manager',
        title: null,
        label: 'Company Manager',
        delim: null
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/companies/',
            field: 'company',
            type: 'related'
          }
        ],
        name: 'company',
        sort_field: 'company',
        label: 'Client',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/hr/jobsites/',
            field: 'jobsite',
            type: 'related'
          }
        ],
        name: 'jobsite',
        sort_field: 'jobsite',
        label: 'Jobsite',
        sort: true
      },
      {
        content: [
          { endpoint: '/ecore/api/v2/hr/jobs/', field: 'job', type: 'related' }
        ],
        name: 'job',
        sort_field: 'job',
        label: 'Job',
        sort: true
      }
    ],
    pagination_label: 'Favourite list',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'company_contact',
        label: 'Company contact',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companycontacts/',
          key: 'id'
        },
        query: 'company_contact'
      },
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
      },
      {
        key: 'job',
        label: 'Job',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/hr/jobs/',
          key: 'id'
        },
        query: 'job'
      }
    ]
  },
  fields: [
    {
      list: false,
      endpoint: '/ecore/api/v2/core/companycontacts/',
      read_only: true,
      templateOptions: {
        label: 'Company Manager',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'company.manager',
      many: false
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/core/companies/',
      read_only: true,
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
      endpoint: '/ecore/api/v2/core/companycontacts/',
      read_only: true,
      templateOptions: {
        label: 'Recruitment Agent',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'company_contact',
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
      list: false,
      endpoint: '/ecore/api/v2/hr/jobs/',
      read_only: true,
      templateOptions: {
        label: 'Job',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'job',
      many: false
    }
  ]
};

const formset = {
  fields: [
    {
      many: false,
      key: 'company',
      endpoint: '/ecore/api/v2/core/companies/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Client',
        type: 'related'
      },
      read_only: false,
      type: 'related'
    },
    {
      many: false,
      key: 'company.manager',
      endpoint: '/ecore/api/v2/core/companycontacts/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Company Manager',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      many: false,
      key: 'job',
      endpoint: '/ecore/api/v2/hr/jobs/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Job',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      many: false,
      key: 'jobsite',
      endpoint: '/ecore/api/v2/hr/jobsites/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Jobsite',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      many: false,
      key: 'company_contact',
      endpoint: '/ecore/api/v2/core/companycontacts/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Recruitment Agent',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    }
  ],
  list: {
    columns: [
      {
        name: 'company_contact',
        sort: true,
        sort_field: 'company_contact',
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            type: 'related',
            field: 'company_contact'
          }
        ],
        label: 'Recruitment Agent'
      },
      {
        name: 'company_manager',
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            label: 'Company Manager',
            type: 'related',
            field: 'company.manager'
          }
        ],
        label: 'Company Manager',
        title: null,
        delim: null
      },
      {
        name: 'company',
        sort: true,
        sort_field: 'company',
        content: [
          {
            endpoint: '/ecore/api/v2/core/companies/',
            type: 'related',
            field: 'company'
          }
        ],
        label: 'Client'
      },
      {
        name: 'jobsite',
        sort: true,
        sort_field: 'jobsite',
        content: [
          {
            endpoint: '/ecore/api/v2/hr/jobsites/',
            type: 'related',
            field: 'jobsite'
          }
        ],
        label: 'Jobsite'
      },
      {
        name: 'job',
        sort: true,
        sort_field: 'job',
        content: [
          { endpoint: '/ecore/api/v2/hr/jobs/', type: 'related', field: 'job' }
        ],
        label: 'Job'
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/ecore/api/v2/hr/favouritelists/{id}',
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
        delim: null
      }
    ],
    list: 'favouritelist',
    editDisable: false,
    label: 'Favourite list',
    pagination_label: 'Favourite list',
    search_enabled: false
  }
};

const form = [
  {
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
  },
  {
    endpoint: '/ecore/api/v2/core/companies/',
    read_only: true,
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
  },
  {
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
  },
  {
    endpoint: '/ecore/api/v2/hr/jobs/',
    read_only: true,
    templateOptions: {
      label: 'Job',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'job',
  },
  {
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Recruitment Agent',
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'company_contact',
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
];

const job = {
  fields: [
    {
      key: 'id',
      templateOptions: {
        action: 'delete',
        label: '',
        type: 'button',
        text: ''
      },
      type: 'button'
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
      many: false,
      key: 'job',
      endpoint: '/ecore/api/v2/hr/jobs/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Job',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      many: false,
      key: 'company_contact',
      endpoint: '/ecore/api/v2/core/companycontacts/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Recruitment Agent',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    }
  ],
  list: {
    columns: [
      {
        name: 'company_contact',
        sort: true,
        sort_field: 'company_contact',
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            type: 'related',
            field: 'company_contact'
          }
        ],
        label: 'Recruitment Agent'
      },
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
        name: 'job',
        sort: true,
        sort_field: 'job',
        content: [
          { endpoint: '/ecore/api/v2/hr/jobs/', type: 'related', field: 'job' }
        ],
        label: 'Job'
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/ecore/api/v2/hr/favouritelists/{id}',
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
    list: 'favouritelist',
    editDisable: false,
    label: 'Favourite list',
    pagination_label: 'Favourite list',
    search_enabled: false
  }
};

const formadd = [
  {
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: false,
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
  },
  {
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
    default: ['{jobsite.regular_company.id}', '{job.customer_company.id}'],
    collapsed: false,
    type: 'related',
    key: 'company',
  },
  {
    endpoint: '/ecore/api/v2/hr/jobsites/',
    read_only: false,
    templateOptions: {
      label: 'Jobsite',
      add: true,
      delete: false,
      values: ['__str__', 'regular_company'],
      type: 'related',
      edit: true
    },
    query: {
      company: '{company.id}'
    },
    default: '{job.jobsite.id}',
    collapsed: false,
    type: 'related',
    key: 'jobsite',
  },
  {
    endpoint: '/ecore/api/v2/hr/jobs/',
    read_only: false,
    templateOptions: {
      label: 'Job',
      add: true,
      delete: false,
      values: ['__str__', 'jobsite', 'customer_company'],
      type: 'related',
      edit: true
    },
    query: {
      customer_company: '{company.id}',
      jobsite: '{jobsite.id}'
    },
    collapsed: false,
    type: 'related',
    key: 'job',
  },
  {
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Recruitment Agent',
      values: ['__str__'],
      type: 'related',
    },
    default: 'session.contact.contact_id',
    query: {
      master_company: 'current'
    },
    type: 'related',
    key: 'company_contact',
  },
];

export const metadata = {
  list,
  formset,
  form,
  formadd,
  job
};
