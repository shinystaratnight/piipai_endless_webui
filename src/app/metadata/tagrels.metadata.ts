const list = {
  list: {
    list: 'tagrel',
    label: 'Tag Relationship',
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
        content: [
          {
            endpoint: '/ecore/api/v2/core/tags/',
            field: 'tag',
            type: 'related'
          }
        ],
        name: 'tag',
        sort_field: 'tag',
        label: 'Tag',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            field: 'verified_by',
            type: 'related'
          }
        ],
        name: 'verified_by',
        sort_field: 'verified_by',
        label: 'Verified by',
        sort: true
      },
      {
        content: [{ field: 'verification_evidence', type: 'input' }],
        name: 'verification_evidence',
        sort_field: 'verification_evidence',
        label: 'Verification Evidence',
        sort: true
      }
    ],
    pagination_label: 'Tag Relationship',
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
      endpoint: '/ecore/api/v2/core/companycontacts/',
      read_only: true,
      templateOptions: {
        label: 'Verified by',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'verified_by',
      many: false
    },
    {
      key: 'verification_evidence',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Verification Evidence',
        type: 'text',
        max: 100
      },
      read_only: true
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/core/tags/',
      read_only: true,
      templateOptions: {
        label: 'Tag',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'tag',
      many: false
    }
  ]
};

const formset = {
  fields: [
    {
      many: false,
      key: 'tag',
      endpoint: '/ecore/api/v2/core/tags/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Tag',
        type: 'related'
      },
      read_only: false,
      type: 'related'
    },
    {
      key: 'id',
      templateOptions: {
        action: 'editForm',
        label: '',
        type: 'button',
        text: ''
      },
      type: 'button'
    },
    {
      key: 'verification_evidence',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Verification Evidence',
        max: 100,
        type: 'picture'
      },
      type: 'input'
    },
    {
      many: false,
      key: 'verified_by',
      endpoint: '/ecore/api/v2/core/companycontacts/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Verified by',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    }
  ],
  list: {
    columns: [
      {
        name: 'tag',
        sort: true,
        sort_field: 'tag',
        content: [
          {
            endpoint: '/ecore/api/v2/core/tags/',
            type: 'related',
            field: 'tag'
          }
        ],
        label: 'Tag'
      },
      {
        name: 'verified_by',
        sort: true,
        sort_field: 'verified_by',
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            type: 'related',
            field: 'verified_by'
          }
        ],
        label: 'Verified by'
      },
      {
        name: 'verification_evidence',
        sort_field: 'verification_evidence',
        title: null,
        sort: true,
        content: [{ type: 'picture', field: 'verification_evidence' }],
        label: 'Verification Evidence',
        delim: null
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/ecore/api/v2/candidate/tagrels/{id}',
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
    list: 'tagrel',
    editDisable: false,
    label: 'Tag Relationship',
    pagination_label: 'Tag Relationship',
    search_enabled: false
  }
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    hide: true,
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
    endpoint: '/ecore/api/v2/core/tags/',
    read_only: false,
    key: 'tag',
    templateOptions: {
      label: 'Tag',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    query: { exclude: '{candidate_contact.id}' },
    many: false
  },
  {
    key: 'verification_evidence',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Verification Evidence',
      max: 100,
      type: 'picture'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Verified by',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    default: 'session.contact.contact_id',
    type: 'related',
    key: 'verified_by',
    many: false
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    hide: true,
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
    endpoint: '/ecore/api/v2/core/tags/',
    read_only: false,
    key: 'tag',
    templateOptions: {
      label: 'Tag',
      add: true,
      delete: false,
      values: ['__str__', 'evidence_required_for_approval'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    query: { exclude: '{candidate_contact.id}' },
    many: false
  },
  {
    key: 'verification_evidence',
    type: 'input',
    showIf: ['tag.id', { 'tag.evidence_required_for_approval': true }],
    templateOptions: {
      required: false,
      label: 'Verification Evidence',
      max: 100,
      type: 'picture'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Verified by',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    default: 'session.contact.contact_id',
    type: 'related',
    key: 'verified_by',
    many: false
  }
];

export const metadata = {
  list,
  formset,
  form,
  formadd
};