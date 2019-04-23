import { createFilter, Type } from '../../dynamic-form/models/filters';
import { Endpoints, currency } from '../helpers';

const filters = {
  recruitmentAgent: createFilter(Type.Relared, {
    key: 'customer_company',
    label: 'Client company',
    endpoint: Endpoints.Company,
  }),
  date: createFilter(Type.Date, {
    key: 'date',
    label: 'Date',
    yesterday: true,
    today: true,
    tomorrow: true
  })
};

const formFields = {
  currency: {
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
  },
  date: {
    key: 'date',
    read_only: true,
    templateOptions: {
      required: false,
      label: 'Creation date',
      type: 'date'
    },
    type: 'datepicker'
  },
};

const list = {
  list: {
    list: 'invoice',
    label: 'Company Invoices',
    buttons: [],
    filters: [
      filters.recruitmentAgent,
      filters.date
    ],
    columns: [
      {
        content: [
          {
            endpoint: Endpoints.Company,
            field: 'customer_company',
            type: 'related'
          }
        ],
        name: 'customer_company',
        sort_field: 'customer_company',
        label: 'Client company',
        sort: true
      },
      {
        content: [
          {
            field: 'date',
            type: 'datepicker'
          }
        ],
        name: 'date',
        sort_field: 'date',
        label: 'Creation date',
        sort: true
      },
      {
        content: [
          {
            field: 'total',
            type: 'input'
          }
        ],
        name: 'total',
        sort_field: 'total',
        label: 'Total',
        sort: true
      },
      {
        content: [
          {
            field: 'tax',
            type: 'input'
          }
        ],
        name: 'tax',
        sort_field: 'tax',
        label: 'GST',
        sort: true
      },
      {
        content: [
          {
            field: 'total_with_tax',
            type: 'input'
          }
        ],
        name: 'total_with_tax',
        sort_field: 'total_with_tax',
        label: 'Total with GST',
        sort: true
      },
      {
        content: [
          {
            field: 'period',
            type: 'input'
          }
        ],
        name: 'period',
        sort_field: 'period',
        label: 'Period',
        sort: true
      },
      {
        content: [
          {
            field: 'separation_rule',
            type: 'input'
          }
        ],
        name: 'separation_rule',
        sort_field: 'separation_rule',
        label: 'Separation rule',
        sort: true
      },
      {
        delim: null,
        label: 'Number',
        sort: true,
        content: [
          {
            field: 'number',
            type: 'text'
          }
        ],
        name: 'number',
        title: null,
        sort_field: 'number'
      },
      {
        delim: null,
        label: '',
        content: [
          {
            endpoint: `${Endpoints.Invoice}{id}/pdf/`,
            field: 'id',
            icon: 'fa-eye',
            action: 'previewInvoice',
            type: 'button',
            text: 'Preview'
          }
        ],
        name: 'id',
        title: null,
        sort_field: 'id'
      },
      {
        delim: null,
        label: '',
        content: [
          {
            endpoint: `${Endpoints.Invoice}{id}/pdf/`,
            field: 'id',
            icon: 'fa-print',
            action: 'printInvoice',
            type: 'button',
            text: 'Print'
          }
        ],
        name: 'id',
        title: null,
        sort_field: 'id'
      },
      {
        delim: ' ',
        label: 'Status',
        content: [
          {
            endpoint: `${Endpoints.Invoice}{id}/approve/`,
            field: 'id',
            icon: 'fa-external-link',
            color: 'success',
            action: 'emptyPost',
            type: 'button',
            text: 'Approve',
            hidden: 'approved'
          },
          {
            showIf: ['approved'],
            field: 'approved',
            type: 'text',
            color: 'success',
            values: {
              true: 'check-circle'
            },
          },
          {
            showIf: [
              'approved',
              {
                synced_at: null
              }
            ],
            field: 'approved',
            type: 'text',
            color: 'success',
            display: 'Approved',
          },
          {
            showIf: ['synced_at'],
            field: 'synced_at',
            type: 'text',
            color: 'success',
            display: 'Approved/Synced',
          }
        ],
        name: 'id',
        title: null,
        sort_field: 'id'
      }
    ],
    pagination_label: 'Company Invoice',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    formFields.date
  ]
};

const formset = {
  fields: [
    formFields.date
  ],
  list: {
    columns: [
      {
        name: 'customer_company',
        sort: true,
        sort_field: 'customer_company',
        content: [
          {
            endpoint: Endpoints.Company,
            type: 'related',
            field: 'customer_company'
          }
        ],
        label: 'Client company'
      },
      {
        name: 'date',
        sort: true,
        sort_field: 'date',
        content: [{ type: 'datepicker', field: 'date' }],
        label: 'Creation date'
      },
      {
        name: 'total',
        sort: true,
        sort_field: 'total',
        content: [{ type: 'input', field: 'total' }],
        label: 'Total'
      },
      {
        name: 'tax',
        sort: true,
        sort_field: 'tax',
        content: [{ type: 'input', field: 'tax' }],
        label: 'GST'
      },
      {
        name: 'total_with_tax',
        sort: true,
        sort_field: 'total_with_tax',
        content: [{ type: 'input', field: 'total_with_tax' }],
        label: 'Total with GST'
      },
      {
        name: 'period',
        sort: true,
        sort_field: 'period',
        content: [{ type: 'input', field: 'period' }],
        label: 'Period'
      },
      {
        name: 'separation_rule',
        sort: true,
        sort_field: 'separation_rule',
        content: [{ type: 'input', field: 'separation_rule' }],
        label: 'Separation rule'
      },
      {
        name: 'number',
        sort_field: 'number',
        title: null,
        sort: true,
        content: [{ type: 'text', field: 'number' }],
        label: 'Number',
        delim: null
      },
      {
        name: 'id',
        sort_field: 'id',
        title: null,
        sort: true,
        content: [
          {
            action: 'previewInvoice',
            endpoint: `${Endpoints.Invoice}{id}/pdf/`,
            icon: 'fa-eye',
            text: 'Preview',
            type: 'button',
            field: 'id'
          }
        ],
        label: '',
        delim: null
      },
      {
        name: 'id',
        sort_field: 'id',
        title: null,
        sort: true,
        content: [
          {
            action: 'printInvoice',
            endpoint: `${Endpoints.Invoice}{id}/pdf/`,
            icon: 'fa-print',
            text: 'Print',
            type: 'button',
            field: 'id'
          }
        ],
        label: '',
        delim: null
      },
      {
        name: 'id',
        sort_field: 'id',
        title: null,
        sort: true,
        content: [
          {
            action: 'emptyPost',
            endpoint: `${Endpoints.Invoice}{id}/approve/`,
            icon: 'fa-external-link',
            text: 'Approve',
            type: 'button',
            field: 'id'
          }
        ],
        label: '',
        delim: null
      }
    ],
    list: 'invoice',
    editDisable: false,
    label: 'Company Invoices',
    pagination_label: 'Company Invoice',
    search_enabled: false
  }
};

const form = [
  {
    label: '{customer_company.__str__} - {date}',
    type: 'row',
    children: [
      {
        type: 'column',
        children: [
          {
            list: false,
            endpoint: Endpoints.Company,
            read_only: true,
            templateOptions: {
              label: 'Provider Company',
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
            endpoint: Endpoints.CompanyContact,
            read_only: true,
            templateOptions: {
              label: 'Provider Representative',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'related',
              edit: true
            },
            collapsed: false,
            type: 'related',
            key: 'provider_representative',
            many: false
          },
          {
            list: false,
            endpoint: Endpoints.Company,
            read_only: true,
            templateOptions: {
              label: 'Client Company',
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
            type: 'datepicker',
            key: 'synced_at',
            read_only: true,
            templateOptions: {
              label: 'Synced at',
              type: 'datetime'
            }
          },
          {
            type: 'checkbox',
            key: 'approved',
            hide: true,
            templateOptions: {}
          },
          {
            type: 'button',
            color: 'primary',
            showIf: [ 'approved' ],
            templateOptions: {
              action: 'syncInvoice',
              text: 'Sync',
              type: 'button',
              small: true,
              p: true
            }
          }
        ]
      },
      {
        type: 'column',
        children: [
          {
            key: 'total_with_tax',
            default: 0.0,
            type: 'input',
            templateOptions: {
              required: false,
              label: 'Total wit GST',
              type: 'text'
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
              type: 'text'
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
              type: 'text'
            },
            read_only: false
          },
          {
            key: 'is_paid',
            default: false,
            type: 'checkbox',
            templateOptions: {
              required: false,
              label: 'Is paid',
              type: 'checkbox'
            },
            read_only: false
          },
          {
            key: 'paid_at',
            type: 'datepicker',
            templateOptions: {
              required: false,
              label: 'Paid at',
              type: 'date'
            },
            read_only: true
          },
          formFields.currency,
          {
            key: 'number',
            type: 'input',
            templateOptions: {
              required: false,
              label: 'Invoice No',
              max: 20,
              type: 'text'
            },
            read_only: false
          },
          {
            key: 'order_number',
            type: 'input',
            templateOptions: {
              required: false,
              label: 'Your Order No',
              type: 'text'
            },
            read_only: false
          },
          {
            key: 'period',
            type: 'input',
            templateOptions: {
              required: false,
              label: 'Period',
              max: 255,
              type: 'text'
            },
            read_only: false
          },
          {
            key: 'separation_rule',
            type: 'input',
            templateOptions: {
              required: false,
              label: 'Separation rule',
              max: 255,
              type: 'text'
            },
            read_only: false
          },
          formFields.date
        ]
      }
    ]
  },
  {
    endpoint: Endpoints.InvoiceRule,
    templateOptions: {
      label: 'Invoice Lines',
      type: 'list',
      text: 'Invoice Lines'
    },
    collapsed: false,
    prefilled: {
      invoice: '{id}'
    },
    type: 'list',
    query: {
      invoice: '{id}'
    }
  }
];

const formadd = form;

export const metadata = {
  list,
  formset,
  form,
  formadd
};
