const list = {
  list: {
    list: 'invoiceline',
    label: 'Invoice Line',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Invoice Line'
      }
    ],
    pagination_label: 'Invoice Line',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Invoice Line',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/core/invoices/',
    read_only: true,
    templateOptions: {
      label: 'Invoice',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'invoice',
    many: false
  },
  {
    key: 'date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Date', type: 'date' },
    read_only: false
  },
  {
    key: 'units',
    type: 'input',
    templateOptions: { required: true, label: 'Units', type: 'number' },
    read_only: false
  },
  {
    key: 'notes',
    type: 'textarea',
    templateOptions: { required: true, label: 'Notes', type: 'textarea' },
    read_only: false
  },
  {
    key: 'unit_price',
    type: 'input',
    templateOptions: { required: true, label: 'Rate', type: 'number' },
    read_only: false
  },
  {
    key: 'amount',
    type: 'input',
    templateOptions: { required: true, label: 'Amount', type: 'number' },
    read_only: false
  },
  {
    key: 'unit_type',
    default: 'unit',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Unit type',
      type: 'select',
      options: [{ value: 'unit', label: 'Unit' }]
    },
    read_only: false
  },
  { key: 'vat' }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/core/invoices/',
    read_only: true,
    templateOptions: {
      label: 'Invoice',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'invoice',
    many: false
  },
  {
    key: 'date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'Date', type: 'date' },
    read_only: false
  },
  {
    key: 'units',
    type: 'input',
    templateOptions: { required: true, label: 'Units', type: 'number' },
    read_only: false
  },
  {
    key: 'notes',
    type: 'textarea',
    templateOptions: { required: true, label: 'Notes', type: 'textarea' },
    read_only: false
  },
  {
    key: 'unit_price',
    type: 'input',
    templateOptions: { required: true, label: 'Rate', type: 'number' },
    read_only: false
  },
  {
    key: 'amount',
    type: 'input',
    templateOptions: { required: true, label: 'Amount', type: 'number' },
    read_only: false
  },
  {
    key: 'unit_type',
    default: 'unit',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Unit type',
      type: 'select',
      options: [{ value: 'unit', label: 'Unit' }]
    },
    read_only: false
  },
  { key: 'vat' }
];

export const metadata = {
  list,
  form,
  formadd
};
