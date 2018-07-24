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

const formset = {
  fields: [
    {
      default: false,
      key: 'confirmed_available',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Confirmed Available',
        type: 'checkbox'
      },
      type: 'checkbox'
    },
    {
      many: false,
      key: 'job_offer',
      endpoint: '/ecore/api/v2/hr/joboffers/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Job offer',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      key: 'target_date',
      read_only: false,
      templateOptions: { required: false, label: 'Target Date', type: 'date' },
      type: 'datepicker'
    }
  ],
  list: {
    columns: [
      {
        name: 'target_date',
        sort: true,
        sort_field: 'target_date',
        content: [{ type: 'datepicker', field: 'target_date' }],
        label: 'Target Date'
      },
      {
        name: 'confirmed_available',
        sort: true,
        sort_field: 'confirmed_available',
        content: [{ type: 'checkbox', field: 'confirmed_available' }],
        label: 'Confirmed Available'
      },
      {
        name: 'job_offer',
        sort: true,
        sort_field: 'job_offer',
        content: [
          {
            endpoint: '/ecore/api/v2/hr/joboffers/',
            type: 'related',
            field: 'job_offer'
          }
        ],
        label: 'Job offer'
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/ecore/api/v2/hr/carrierlists/{id}',
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
    list: 'carrierlist',
    editDisable: false,
    label: 'Carrier List',
    pagination_label: 'Carrier List',
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
    type: 'related',
    key: 'candidate_contact',
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
    type: 'related',
    key: 'skill',
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

const formadd = [
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
    type: 'related',
    key: 'candidate_contact',
  },
  {
    key: 'target_date',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Target Date', type: 'date' },
    read_only: false
  },
  {
    key: 'confirmed_available',
    default: true,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Confirmed Available',
      type: 'checkbox'
    },
    read_only: false
  },
  {
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
    type: 'related',
    key: 'skill',
  }
];

export const metadata = {
  list,
  formset,
  form,
  formadd
};