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

const formset = {
  fields: [
    {
      key: 'company_contact.job_title',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Job title',
        max: 31,
        type: 'text'
      },
      type: 'input'
    },
    {
      default: true,
      key: 'company_contact.receive_job_confirmation_sms',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Receive Job confirmation sms',
        type: 'checkbox'
      },
      type: 'checkbox'
    },
    {
      key: 'company_contact.contact.last_name',
      read_only: false,
      templateOptions: {
        required: true,
        label: 'Last Name',
        max: 255,
        type: 'text'
      },
      type: 'input'
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
      key: 'company_contact.contact.email',
      read_only: false,
      templateOptions: {
        required: true,
        label: 'E-mail',
        max: 255,
        type: 'email'
      },
      type: 'input'
    },
    {
      key: 'company_contact.contact.first_name',
      read_only: false,
      templateOptions: {
        required: true,
        label: 'First Name',
        max: 255,
        type: 'text'
      },
      type: 'input'
    },
    {
      key: 'company_contact.contact.phone_mobile',
      read_only: false,
      templateOptions: { required: true, label: 'Mobile Phone', type: 'text' },
      type: 'input'
    }
  ],
  list: {
    columns: [
      {
        name: 'company_contact.job_title',
        sort: true,
        sort_field: 'company_contact.job_title',
        content: [{ type: 'input', field: 'company_contact.job_title' }],
        label: 'Job title'
      },
      {
        name: 'company_contact.contact.first_name',
        sort: true,
        sort_field: 'company_contact.contact.first_name',
        content: [
          { type: 'input', field: 'company_contact.contact.first_name' }
        ],
        label: 'First Name'
      },
      {
        name: 'company_contact.contact.last_name',
        sort: true,
        sort_field: 'company_contact.contact.last_name',
        content: [
          { type: 'input', field: 'company_contact.contact.last_name' }
        ],
        label: 'Last Name'
      },
      {
        name: 'company_contact.contact.phone_mobile',
        sort: true,
        sort_field: 'company_contact.contact.phone_mobile',
        content: [
          { type: 'input', field: 'company_contact.contact.phone_mobile' }
        ],
        label: 'Mobile Phone'
      },
      {
        name: 'company_contact.contact.email',
        sort: true,
        sort_field: 'company_contact.contact.email',
        content: [{ type: 'input', field: 'company_contact.contact.email' }],
        label: 'E-mail'
      },
      {
        name: 'company_contact.receive_job_confirmation_sms',
        sort: true,
        sort_field: 'company_contact.receive_job_confirmation_sms',
        content: [
          {
            type: 'checkbox',
            field: 'company_contact.receive_job_confirmation_sms'
          }
        ],
        label: 'Receive Job confirmation sms'
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/core/companycontacts/{company_contact.id}',
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
    list: 'companycontactrelationship',
    editDisable: false,
    label: 'Client Contact Relations',
    pagination_label: 'Client Contacts',
    search_enabled: false
  }
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
    endpoint: '/core/companycontacts/',
    read_only: false,
    templateOptions: {
      label: 'Company contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
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
    endpoint: '/core/companycontacts/',
    read_only: false,
    templateOptions: {
      label: 'Company contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
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
  formset,
  form,
  formadd
};
