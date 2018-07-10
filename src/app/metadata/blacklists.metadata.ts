const list = {
  list: {
    list: 'blacklist',
    label: 'Black list',
    columns: [
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
        label: 'Company',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/{company_contact.id}',
            field: 'company_contact',
            type: 'link'
          }
        ],
        name: 'company_contact',
        label: 'Client Contact'
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
            endpoint: '/ecore/api/v2/hr/jobsites/{jobsite.id}',
            field: 'jobsite',
            type: 'link'
          }
        ],
        name: 'jobsite',
        sort_field: 'jobsite',
        label: 'Jobsite',
        sort: true
      }
    ],
    pagination_label: 'Black list',
    search_enabled: true,
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
      endpoint: '/ecore/api/v2/core/companies/',
      read_only: true,
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
        label: 'Company',
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
  ],
  list: {
    columns: [
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
        label: 'Company'
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
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/ecore/api/v2/hr/blacklists/{id}',
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
    list: 'blacklist',
    editDisable: false,
    label: 'Black list',
    pagination_label: 'Black list',
    search_enabled: false
  }
};

const form = [
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
      label: 'Client contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    query: {
      company: '{company.id}'
    },
    collapsed: false,
    type: 'related',
    key: 'company_contact',
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
    query: {
      company: '{company.id}'
    },
    collapsed: false,
    type: 'related',
    key: 'jobsite',
    many: false
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Created at', type: 'datetime' },
    read_only: true
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Updated at', type: 'datetime' },
    read_only: true
  },
];

const formadd = [
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
      label: 'Client contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    query: {
      company: '{company.id}'
    },
    collapsed: false,
    type: 'related',
    key: 'company_contact',
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
    query: {
      company: '{company.id}'
    },
    collapsed: false,
    type: 'related',
    key: 'jobsite',
    many: false
  },
];

export const metadata = {
  list,
  formset,
  form,
  formadd
};
