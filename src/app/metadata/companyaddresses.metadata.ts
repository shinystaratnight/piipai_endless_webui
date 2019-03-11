const list = {
  list: {
    list: 'companyaddress',
    label: 'Client Company Address',
    pagination_label: 'Client Company Addresses',
    columns: [
      {
        delim: null,
        label: 'Company',
        sort: true,
        content: [
          {
            endpoint: '/core/companies/{company.id}/',
            field: 'company.name',
            type: 'link'
          },
        ],
        name: 'company',
        title: null,
        sort_field: 'company.name'
      },
      {
        content: [
          {
            endpoint: '/',
            fields: [
              { values: { true: 'HQ:' }, field: 'hq', type: 'checkbox' },
              { field: 'address.__str__', type: 'static' }
            ],
            type: 'link'
          },
          {
            icon: 'fa-globe',
            action: 'openMap',
            fields: [
              { field: 'address.latitude', type: 'input' },
              { field: 'address.longitude', type: 'input' }
            ],
            type: 'button',
            text: 'Open map'
          }
        ],
        name: 'branch',
        title: null,
        label: 'Branch',
        delim: null
      },
      {
        content: [
          {
            endpoint: '/',
            field: 'primary_contact.contact.__str__',
            type: 'link'
          },
          {
            field: 'primary_contact.contact.phone_mobile',
            type: 'link',
            link: 'tel:{primary_contact.contact.phone_mobile}'
          },
          {
            icon: 'fa-commenting',
            action: 'sendSMS',
            fields: [
              { field: 'primary_contact.contact.phone_mobile', type: 'link' }
            ],
            type: 'button',
            text: 'SMS'
          }
        ],
        name: 'primary_contact',
        context_menu: [
          { endpoint: '/', label: 'Send SMS' },
          { endpoint: '/', label: 'Add New Company Contact' },
          { endpoint: '/', label: 'Manage Branch Contacts' },
          { endpoint: '/', label: 'Add Note' },
          { endpoint: '/', label: 'Add Activity' }
        ],
        label: 'Primary Contact'
      },
      {
        delim: null,
        label: 'Portfolio Manager',
        sort: true,
        content: [
          {
            endpoint: '/',
            field: 'portfolio_manager',
            type: 'link',
            label: 'Portfolio Manager'
          }
        ],
        name: 'portfolio_manager',
        title: null,
        context_menu: [
          { endpoint: '/', label: 'Create Activity for PM' },
          { endpoint: '/', label: 'Reassign' }
        ],
        sort_field: 'portfolio_manager'
      },
      {
        content: [{ field: 'active_states', type: 'static', label: 'State' }],
        name: 'state',
        title: null,
        label: 'State',
        delim: null
      },
      {
        delim: null,
        label: 'Credit',
        content: [
          {
            endpoint: '/',
            fields: [
              {
                values: { true: 'Approved', false: 'Not Approved' },
                field: 'company.credit_check',
                type: 'select'
              },
              { field: 'company.approved_credit_limit', type: 'input' },
              { field: 'company.get_terms_of_payment', type: 'input' }
            ],
            type: 'link'
          }
        ],
        name: 'credit',
        title: null,
        context_menu: [
          { endpoint: '/', label: 'Reupload evidence' },
          { endpoint: '/', label: 'Fill in credit approval information' }
        ]
      },
    ],
    highlight: { values: { master: true }, field: 'company.type' },
    filters: [
      {
        key: 'company',
        label: 'Company',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/core/companies/',
          key: 'id'
        },
        query: 'company'
      },
      {
        key: 'primary_contact.contact',
        label: 'Contact',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/core/contacts/',
          key: 'id'
        },
        query: 'primary_contact__contact'
      },
      {
        key: 'active_states',
        label: 'State',
        options: [
          { value: 0, label: 'Sales Failed' },
          { value: 10, label: 'Found Lead' },
          { value: 20, label: 'Analyzed' },
          { value: 30, label: 'Qualified Lead' },
          { value: 40, label: 'Proposal Presented' },
          { value: 60, label: 'Contract Signed' },
          { value: 70, label: 'Extranet Access' },
          { value: 80, label: 'Credit Hold' },
          { value: 90, label: 'Contract Terminated' }
        ],
        query: 'active_states',
        default: null,
        type: 'select'
      },
      {
        key: 'portfolio_manager',
        label: 'Portfolio Manager',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/core/companycontacts/',
          key: 'id'
        },
        query: 'portfolio_manager'
      },
      {
        list: [
          {
            label: 'Yesterday',
            query: 'updated_at_0=2018-07-03&updated_at_1=2018-07-03'
          },
          {
            label: 'Today',
            query: 'updated_at_0=2018-07-04&updated_at_1=2018-07-04'
          }
        ],
        key: 'updated_at',
        label: 'Updated at',
        type: 'date',
        input: [
          { label: 'From', query: 'updated_at_0' },
          { label: 'To', query: 'updated_at_1' }
        ]
      }
    ],
    search_enabled: false,
    editDisable: false,
    actions: {
      options: [
        {
          endpoint: '/core/companyaddresses/delete/',
          label: 'Delete selected',
          confirm: true,
          message: 'Are you sure?'
        },
        {
          endpoint: '/core/companyaddresses/sendsms/',
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
      key: 'hq',
      default: false,
      type: 'checkbox',
      templateOptions: { required: false, label: 'HQ', type: 'checkbox' },
      read_only: true
    },
    {
      key: 'active_states',
      type: 'static',
      templateOptions: { required: false, label: 'State', type: 'static' },
      read_only: true
    },
    {
      key: 'invoices_count',
      type: 'button',
      templateOptions: {
        action: 'openList',
        label: 'Invoices:',
        type: 'button',
        text: '{field}'
      },
      read_only: true
    },
    {
      key: 'company.approved_credit_limit',
      default: 0.0,
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Approved Credit Limit',
        type: 'number'
      },
      read_only: true
    },
    {
      key: 'company.credit_check',
      default: false,
      type: 'select',
      templateOptions: {
        required: false,
        label: 'Credit Check',
        type: 'select',
        options: [
          { value: true, label: 'Approved' },
          { value: false, label: 'Not Approved' }
        ]
      },
      read_only: true
    },
    {
      key: 'primary_contact.contact.phone_mobile',
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
      key: 'company.get_terms_of_payment',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Get terms of payment',
        type: 'text'
      },
      read_only: true
    },
    {
      key: 'orders_count',
      type: 'button',
      templateOptions: {
        action: 'openList',
        label: 'Orders:',
        type: 'button',
        text: '{field}'
      },
      read_only: true
    },
    {
      key: 'portfolio_manager',
      type: 'link',
      templateOptions: {
        label: 'Portfolio Manager',
        type: 'link',
        link: null,
        text: 'Portfolio Manager'
      },
      read_only: true
    },
    {
      key: 'id',
      type: 'button',
      templateOptions: {
        action: 'openList',
        label: '',
        type: 'button',
        text: 'Open Journal'
      },
      read_only: true
    },
    {
      key: 'company.name',
      type: 'link',
      templateOptions: { label: '', type: 'link', link: null, text: '' },
      read_only: true
    },
    {
      key: 'primary_contact.contact.__str__',
      type: 'static',
      templateOptions: { required: false, label: 'Contact', type: 'static' },
      read_only: true
    },
    {
      key: 'address.latitude',
      default: 0,
      type: 'input',
      templateOptions: { required: false, label: 'Latitude', type: 'number' },
      read_only: true
    },
    {
      key: 'address.__str__',
      type: 'static',
      templateOptions: { required: false, label: 'Address', type: 'static' },
      read_only: true
    },
    {
      key: 'address.longitude',
      default: 0,
      type: 'input',
      templateOptions: { required: false, label: 'Longitude', type: 'number' },
      read_only: true
    }
  ]
};

const formset = {
  fields: [
    {
      key: 'primary_contact',
      templateOptions: {
        link: null,
        label: 'Primary Contact',
        type: 'link',
        text: 'Primary Contact'
      },
      type: 'link'
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
      default: true,
      key: 'active',
      read_only: false,
      templateOptions: { required: false, label: 'Active', type: 'checkbox' },
      type: 'checkbox'
    },
    {
      key: 'phone_fax',
      read_only: false,
      templateOptions: { required: false, label: 'Fax', type: 'text' },
      type: 'input'
    },
    {
      default: false,
      key: 'hq',
      read_only: false,
      templateOptions: { required: false, label: 'HQ', type: 'checkbox' },
      type: 'checkbox'
    },
    {
      key: 'address',
      templateOptions: {
        link: null,
        label: 'Address',
        type: 'link',
        text: 'Address'
      },
      type: 'link'
    },
    {
      key: 'phone_landline',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Landline Phone',
        type: 'text'
      },
      type: 'input'
    }
  ],
  list: {
    actions: {
      button_label: 'Go',
      decline_label: 'Decline',
      label: 'Actions',
      options: [
        {
          message: 'Are you sure?',
          endpoint: '/core/companyaddresses/delete/',
          label: 'Delete selected',
          confirm: true
        },
        {
          message: 'Are you sure?',
          endpoint: '/core/companyaddresses/sendsms/',
          label: 'Send sms',
          confirm: false
        }
      ],
      agree_label: 'Agree'
    },
    columns: [
      {
        name: 'hq',
        sort: true,
        sort_field: 'hq',
        content: [{ type: 'checkbox', field: 'hq' }],
        label: 'HQ'
      },
      {
        name: 'address',
        sort_field: 'address',
        title: null,
        sort: true,
        content: [
          {
            endpoint: '/core/addresses/{address.id}/',
            label: 'Address',
            type: 'link',
            field: 'address'
          }
        ],
        label: 'Address',
        delim: null
      },
      {
        name: 'primary_contact',
        sort_field: 'primary_contact',
        title: null,
        context_menu: [
          { endpoint: '/', label: 'Send SMS' },
          { endpoint: '/', label: 'Add New Company Contact' },
          { endpoint: '/', label: 'Manage Branch Contacts' },
          { endpoint: '/', label: 'Add Note' },
          { endpoint: '/', label: 'Add Activity' }
        ],
        sort: true,
        content: [
          {
            endpoint:
              '/core/companycontacts/{primary_contact.id}/',
            label: 'Primary Contact',
            type: 'link',
            field: 'primary_contact'
          }
        ],
        label: 'Primary Contact',
        delim: null
      },
      {
        name: 'phone_landline',
        sort: true,
        sort_field: 'phone_landline',
        content: [{ type: 'input', field: 'phone_landline' }],
        label: 'Landline Phone'
      },
      {
        name: 'phone_fax',
        sort: true,
        sort_field: 'phone_fax',
        content: [{ type: 'input', field: 'phone_fax' }],
        label: 'Fax'
      },
      {
        name: 'active',
        sort: true,
        sort_field: 'active',
        content: [{ type: 'checkbox', field: 'active' }],
        label: 'Active'
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/core/companyaddresses/{id}',
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
    list: 'companyaddress',
    editDisable: false,
    highlight: { values: { master: true }, field: 'company.type' },
    label: 'Client Company Address',
    pagination_label: 'Client Company Addresses',
    search_enabled: false
  }
};

const form = [
  {
    key: 'name',
    type: 'input',
    templateOptions: { required: false, label: 'Name', max: 63, type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/core/companies/',
    read_only: false,
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
    endpoint: '/core/addresses/',
    read_only: false,
    templateOptions: {
      label: 'Address',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'address',
      edit: true
    },
    collapsed: false,
    type: 'address',
    key: 'address',
    many: false
  },
  {
    key: 'hq',
    default: false,
    type: 'checkbox',
    templateOptions: { required: false, label: 'HQ', type: 'checkbox' },
    read_only: false
  },
  {
    key: 'phone_landline',
    type: 'input',
    templateOptions: { required: false, label: 'Landline Phone', type: 'text' },
    read_only: false
  },
  {
    key: 'phone_fax',
    type: 'input',
    templateOptions: { required: false, label: 'Fax', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/core/companycontacts/',
    read_only: false,
    key: 'primary_contact',
    templateOptions: {
      label: 'Primary contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
    prefilled: { company: '{company.id}' },
    type: 'related',
    query: { company: '{company.id}' },
    many: false
  },
  {
    key: 'active',
    default: true,
    type: 'checkbox',
    templateOptions: { required: false, label: 'Active', type: 'checkbox' },
    read_only: false
  }
];

const formadd = [
  {
    key: 'name',
    type: 'input',
    templateOptions: { required: false, label: 'Name', max: 63, type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/core/companies/',
    read_only: false,
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
    endpoint: '/core/addresses/',
    read_only: false,
    templateOptions: {
      required: true,
      label: 'Address',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'address',
      edit: true
    },
    collapsed: false,
    type: 'address',
    key: 'address',
    many: false
  },
  {
    key: 'hq',
    default: false,
    type: 'checkbox',
    templateOptions: { required: false, label: 'HQ', type: 'checkbox' },
    read_only: false
  },
  {
    key: 'phone_landline',
    type: 'input',
    templateOptions: { required: false, label: 'Landline Phone', type: 'text' },
    read_only: false
  },
  {
    key: 'phone_fax',
    type: 'input',
    templateOptions: { required: false, label: 'Fax', type: 'text' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/core/companycontacts/',
    read_only: false,
    key: 'primary_contact',
    templateOptions: {
      label: 'Primary contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    prefilled: { company: '{company.id}' },
    type: 'related',
    query: { company: '{company.id}' },
    many: false
  },
  {
    key: 'active',
    default: true,
    type: 'checkbox',
    templateOptions: { required: false, label: 'Active', type: 'checkbox' },
    read_only: false
  }
];

export const metadata = {
  list,
  formset,
  form,
  formadd
};
