import { currency } from '../helpers';

const list = {
  list: {
    list: 'order',
    label: 'Order',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Order'
      }
    ],
    pagination_label: 'Order',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: { required: false, label: 'Order', type: 'static' },
      read_only: true
    }
  ]
};

const form = [
  {
    key: 'order_lines'
  },
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      label: 'Id',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Updated at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Created at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    list: false,
    endpoint: '/core/companies/',
    read_only: true,
    templateOptions: {
      label: 'Provider company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'provider_company',
    many: false
  },
  {
    list: false,
    endpoint: '/core/companies/',
    read_only: true,
    templateOptions: {
      label: 'Customer company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'customer_company',
    many: false
  },
  {
    list: false,
    endpoint: '/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Provider representative',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
    type: 'related',
    key: 'provider_representative',
    many: false
  },
  {
    list: false,
    endpoint: '/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Customer representative',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
    type: 'related',
    key: 'customer_representative',
    many: false
  },
  {
    key: 'customer_signature',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Customer signature',
      max: 100,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'provider_signature',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Provider signature',
      max: 100,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'customer_signed_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Customer signed at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'provider_signed_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Provider signed at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'total_with_tax',
    default: 0.0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Total with GST',
      type: 'number'
    },
    read_only: false
  },
  {
    key: 'total',
    default: 0.0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Total',
      type: 'number'
    },
    read_only: false
  },
  {
    key: 'tax',
    default: 0.0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'GST',
      type: 'number'
    },
    read_only: false
  },
  {
    key: 'currency',
    default: 'AUD',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Currency',
      type: 'select',
      options: currency
    },
    read_only: false
  }
];

const formadd = [
  { key: 'order_lines' },
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
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
  {
    list: false,
    endpoint: '/core/companies/',
    read_only: true,
    templateOptions: {
      label: 'Provider company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'provider_company',
    many: false
  },
  {
    list: false,
    endpoint: '/core/companies/',
    read_only: true,
    templateOptions: {
      label: 'Customer company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'customer_company',
    many: false
  },
  {
    list: false,
    endpoint: '/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Provider representative',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
    type: 'related',
    key: 'provider_representative',
    many: false
  },
  {
    list: false,
    endpoint: '/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Customer representative',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
    type: 'related',
    key: 'customer_representative',
    many: false
  },
  {
    key: 'customer_signature',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Customer signature',
      max: 100,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'provider_signature',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Provider signature',
      max: 100,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'customer_signed_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Customer signed at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'provider_signed_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Provider signed at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'total_with_tax',
    default: 0.0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Total with GST',
      type: 'number'
    },
    read_only: false
  },
  {
    key: 'total',
    default: 0.0,
    type: 'input',
    templateOptions: { required: false, label: 'Total', type: 'number' },
    read_only: false
  },
  {
    key: 'tax',
    default: 0.0,
    type: 'input',
    templateOptions: { required: false, label: 'GST', type: 'number' },
    read_only: false
  },
  {
    key: 'currency',
    default: 'AUD',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Currency',
      type: 'select',
      options: currency
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
