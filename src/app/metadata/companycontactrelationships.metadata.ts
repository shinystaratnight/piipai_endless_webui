const list = {
  list: {
    list: 'companycontactrelationship',
    label: 'Client Contact Relations',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Company Contact Relationship'
      }
    ],
    pagination_label: 'Client Contacts',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Company Contact Relationship',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    key: 'company',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Company', type: 'text' },
    read_only: true
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: false,
    templateOptions: {
      label: 'Company contact',
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
    key: 'active',
    default: true,
    type: 'checkbox',
    templateOptions: { required: false, label: 'Active', type: 'checkbox' },
    read_only: false
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
  }
];

const formadd = [
  {
    key: 'company',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Company', type: 'text' },
    read_only: true
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: false,
    templateOptions: {
      label: 'Company contact',
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
    key: 'active',
    default: true,
    type: 'checkbox',
    templateOptions: { required: false, label: 'Active', type: 'checkbox' },
    read_only: false
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
  }
];

export const metadata = {
  list,
  form,
  formadd
};
