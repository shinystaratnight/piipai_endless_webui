import { createFilter, Type } from '../dynamic-form/models/filters';

const filters = {
  recruitmentAgent: createFilter(Type.Relared, {
    key: 'customer_company',
    label: 'Client company',
    endpoint: '/core/companies/',
  }),
  date: createFilter(Type.Date, {
    key: 'date',
    label: 'Date',
    yesterday: true,
    today: true,
    tomorrow: true
  })
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
            endpoint: '/core/companies/',
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
            endpoint: '/core/invoices/{id}/pdf/',
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
            endpoint: '/core/invoices/{id}/pdf/',
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
            endpoint: '/core/invoices/{id}/approve/',
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
            showIf: ['approved'],
            field: 'approved',
            type: 'text',
            color: 'success',
            display: 'Approved',
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
    {
      key: 'date',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Creation date',
        type: 'date'
      },
      read_only: true
    },
    {
      key: 'separation_rule',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Separation rule',
        type: 'text',
        max: 255
      },
      read_only: true
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
      read_only: true
    },
    {
      list: false,
      endpoint: '/core/companies/',
      read_only: true,
      templateOptions: {
        label: 'Client company',
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
      key: 'tax',
      default: 0.0,
      type: 'input',
      templateOptions: {
        required: false,
        label: 'GST',
        type: 'number'
      },
      read_only: true
    },
    {
      key: 'id',
      type: 'button',
      templateOptions: {
        action: 'emptyPost',
        label: '',
        type: 'button',
        text: 'Approve'
      },
      read_only: true
    },
    {
      key: 'period',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Period',
        type: 'text',
        max: 255
      },
      read_only: true
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
      read_only: true
    },
    {
      key: 'number',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Number',
        max: 20,
        type: 'text'
      },
      read_only: true
    }
  ]
};

const formset = {
  fields: [
    {
      default: 0.0,
      key: 'total',
      read_only: false,
      templateOptions: { required: false, label: 'Total', type: 'number' },
      type: 'input'
    },
    {
      key: 'separation_rule',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Separation rule',
        max: 255,
        type: 'text'
      },
      type: 'input'
    },
    {
      default: 0.0,
      key: 'tax',
      read_only: false,
      templateOptions: { required: false, label: 'GST', type: 'number' },
      type: 'input'
    },
    {
      key: 'period',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Period',
        max: 255,
        type: 'text'
      },
      type: 'input'
    },
    {
      many: false,
      key: 'customer_company',
      endpoint: '/core/companies/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Client company',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      default: 0.0,
      key: 'total_with_tax',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Total with GST',
        type: 'number'
      },
      type: 'input'
    },
    {
      key: 'date',
      read_only: true,
      templateOptions: {
        required: false,
        label: 'Creation date',
        type: 'date'
      },
      type: 'datepicker'
    },
    {
      key: 'number',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Number',
        max: 20,
        type: 'text'
      },
      type: 'input'
    },
    {
      key: 'id',
      templateOptions: {
        action: 'emptyPost',
        label: '',
        type: 'button',
        text: 'Approve'
      },
      type: 'button'
    }
  ],
  list: {
    columns: [
      {
        name: 'customer_company',
        sort: true,
        sort_field: 'customer_company',
        content: [
          {
            endpoint: '/core/companies/',
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
            endpoint: '/core/invoices/{id}/pdf/',
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
            endpoint: '/core/invoices/{id}/pdf/',
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
            endpoint: '/core/invoices/{id}/approve/',
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
            endpoint: '/core/companies/',
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
            endpoint: '/core/companycontacts/',
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
            endpoint: '/core/companies/',
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
          {
            key: 'currency',
            default: 'AUD',
            type: 'select',
            templateOptions: {
              required: false,
              label: 'Currency',
              type: 'select',
              options: [
                {
                  value: 'AFN',
                  label: 'Afghani'
                },
                {
                  value: 'DZD',
                  label: 'Algerian Dinar'
                },
                {
                  value: 'ARS',
                  label: 'Argentine Peso'
                },
                {
                  value: 'AMD',
                  label: 'Armenian Dram'
                },
                {
                  value: 'AWG',
                  label: 'Aruban Guilder'
                },
                {
                  value: 'AUD',
                  label: 'Australian Dollar'
                },
                {
                  value: 'AZN',
                  label: 'Azerbaijanian Manat'
                },
                {
                  value: 'BSD',
                  label: 'Bahamian Dollar'
                },
                {
                  value: 'BHD',
                  label: 'Bahraini Dinar'
                },
                {
                  value: 'THB',
                  label: 'Baht'
                },
                {
                  value: 'BBD',
                  label: 'Barbados Dollar'
                },
                {
                  value: 'BYR',
                  label: 'Belarussian Ruble'
                },
                {
                  value: 'BZD',
                  label: 'Belize Dollar'
                },
                {
                  value: 'BMD',
                  label:
                    'Bermudian Dollar (customarily known as Bermuda Dollar)'
                },
                {
                  value: 'BTN',
                  label: 'Bhutanese ngultrum'
                },
                {
                  value: 'VEF',
                  label: 'Bolivar Fuerte'
                },
                {
                  value: 'XBA',
                  label: 'Bond Markets Units European Composite Unit (EURCO)'
                },
                {
                  value: 'BRL',
                  label: 'Brazilian Real'
                },
                {
                  value: 'BND',
                  label: 'Brunei Dollar'
                },
                {
                  value: 'BGN',
                  label: 'Bulgarian Lev'
                },
                {
                  value: 'BIF',
                  label: 'Burundi Franc'
                },
                {
                  value: 'XOF',
                  label: 'CFA Franc BCEAO'
                },
                {
                  value: 'XAF',
                  label: 'CFA franc BEAC'
                },
                {
                  value: 'XPF',
                  label: 'CFP Franc'
                },
                {
                  value: 'CAD',
                  label: 'Canadian Dollar'
                },
                {
                  value: 'CVE',
                  label: 'Cape Verde Escudo'
                },
                {
                  value: 'KYD',
                  label: 'Cayman Islands Dollar'
                },
                {
                  value: 'CLP',
                  label: 'Chilean peso'
                },
                {
                  value: 'XTS',
                  label: 'Codes specifically reserved for testing purposes'
                },
                {
                  value: 'COP',
                  label: 'Colombian peso'
                },
                {
                  value: 'KMF',
                  label: 'Comoro Franc'
                },
                {
                  value: 'CDF',
                  label: 'Congolese franc'
                },
                {
                  value: 'BAM',
                  label: 'Convertible Marks'
                },
                {
                  value: 'NIO',
                  label: 'Cordoba Oro'
                },
                {
                  value: 'CRC',
                  label: 'Costa Rican Colon'
                },
                {
                  value: 'HRK',
                  label: 'Croatian Kuna'
                },
                {
                  value: 'CUP',
                  label: 'Cuban Peso'
                },
                {
                  value: 'CUC',
                  label: 'Cuban convertible peso'
                },
                {
                  value: 'CZK',
                  label: 'Czech Koruna'
                },
                {
                  value: 'GMD',
                  label: 'Dalasi'
                },
                {
                  value: 'DKK',
                  label: 'Danish Krone'
                },
                {
                  value: 'MKD',
                  label: 'Denar'
                },
                {
                  value: 'DJF',
                  label: 'Djibouti Franc'
                },
                {
                  value: 'STD',
                  label: 'Dobra'
                },
                {
                  value: 'DOP',
                  label: 'Dominican Peso'
                },
                {
                  value: 'VND',
                  label: 'Dong'
                },
                {
                  value: 'XCD',
                  label: 'East Caribbean Dollar'
                },
                {
                  value: 'EGP',
                  label: 'Egyptian Pound'
                },
                {
                  value: 'ETB',
                  label: 'Ethiopian Birr'
                },
                {
                  value: 'EUR',
                  label: 'Euro'
                },
                {
                  value: 'XBB',
                  label: 'European Monetary Unit (E.M.U.-6)'
                },
                {
                  value: 'XBD',
                  label: 'European Unit of Account 17(E.U.A.-17)'
                },
                {
                  value: 'XBC',
                  label: 'European Unit of Account 9(E.U.A.-9)'
                },
                {
                  value: 'FKP',
                  label: 'Falkland Islands Pound'
                },
                {
                  value: 'FJD',
                  label: 'Fiji Dollar'
                },
                {
                  value: 'HUF',
                  label: 'Forint'
                },
                {
                  value: 'GHS',
                  label: 'Ghana Cedi'
                },
                {
                  value: 'GIP',
                  label: 'Gibraltar Pound'
                },
                {
                  value: 'XAU',
                  label: 'Gold'
                },
                {
                  value: 'XFO',
                  label: 'Gold-Franc'
                },
                {
                  value: 'PYG',
                  label: 'Guarani'
                },
                {
                  value: 'GNF',
                  label: 'Guinea Franc'
                },
                {
                  value: 'GYD',
                  label: 'Guyana Dollar'
                },
                {
                  value: 'HTG',
                  label: 'Haitian gourde'
                },
                {
                  value: 'HKD',
                  label: 'Hong Kong Dollar'
                },
                {
                  value: 'UAH',
                  label: 'Hryvnia'
                },
                {
                  value: 'ISK',
                  label: 'Iceland Krona'
                },
                {
                  value: 'INR',
                  label: 'Indian Rupee'
                },
                {
                  value: 'IRR',
                  label: 'Iranian Rial'
                },
                {
                  value: 'IQD',
                  label: 'Iraqi Dinar'
                },
                {
                  value: 'IMP',
                  label: 'Isle of Man pount'
                },
                {
                  value: 'JMD',
                  label: 'Jamaican Dollar'
                },
                {
                  value: 'JOD',
                  label: 'Jordanian Dinar'
                },
                {
                  value: 'KES',
                  label: 'Kenyan Shilling'
                },
                {
                  value: 'PGK',
                  label: 'Kina'
                },
                {
                  value: 'LAK',
                  label: 'Kip'
                },
                {
                  value: 'KWD',
                  label: 'Kuwaiti Dinar'
                },
                {
                  value: 'AOA',
                  label: 'Kwanza'
                },
                {
                  value: 'MMK',
                  label: 'Kyat'
                },
                {
                  value: 'GEL',
                  label: 'Lari'
                },
                {
                  value: 'LVL',
                  label: 'Latvian Lats'
                },
                {
                  value: 'LBP',
                  label: 'Lebanese Pound'
                },
                {
                  value: 'ALL',
                  label: 'Lek'
                },
                {
                  value: 'HNL',
                  label: 'Lempira'
                },
                {
                  value: 'SLL',
                  label: 'Leone'
                },
                {
                  value: 'LSL',
                  label: 'Lesotho loti'
                },
                {
                  value: 'LRD',
                  label: 'Liberian Dollar'
                },
                {
                  value: 'LYD',
                  label: 'Libyan Dinar'
                },
                {
                  value: 'SZL',
                  label: 'Lilangeni'
                },
                {
                  value: 'LTL',
                  label: 'Lithuanian Litas'
                },
                {
                  value: 'MGA',
                  label: 'Malagasy Ariary'
                },
                {
                  value: 'MWK',
                  label: 'Malawian Kwacha'
                },
                {
                  value: 'MYR',
                  label: 'Malaysian Ringgit'
                },
                {
                  value: 'TMM',
                  label: 'Manat'
                },
                {
                  value: 'MUR',
                  label: 'Mauritius Rupee'
                },
                {
                  value: 'MZN',
                  label: 'Metical'
                },
                {
                  value: 'MXN',
                  label: 'Mexican peso'
                },
                {
                  value: 'MDL',
                  label: 'Moldovan Leu'
                },
                {
                  value: 'MAD',
                  label: 'Moroccan Dirham'
                },
                {
                  value: 'NGN',
                  label: 'Naira'
                },
                {
                  value: 'ERN',
                  label: 'Nakfa'
                },
                {
                  value: 'NAD',
                  label: 'Namibian Dollar'
                },
                {
                  value: 'NPR',
                  label: 'Nepalese Rupee'
                },
                {
                  value: 'ANG',
                  label: 'Netherlands Antillian Guilder'
                },
                {
                  value: 'ILS',
                  label: 'New Israeli Sheqel'
                },
                {
                  value: 'RON',
                  label: 'New Leu'
                },
                {
                  value: 'TWD',
                  label: 'New Taiwan Dollar'
                },
                {
                  value: 'NZD',
                  label: 'New Zealand Dollar'
                },
                {
                  value: 'KPW',
                  label: 'North Korean Won'
                },
                {
                  value: 'NOK',
                  label: 'Norwegian Krone'
                },
                {
                  value: 'PEN',
                  label: 'Nuevo Sol'
                },
                {
                  value: 'MRO',
                  label: 'Ouguiya'
                },
                {
                  value: 'TOP',
                  label: 'Paanga'
                },
                {
                  value: 'PKR',
                  label: 'Pakistan Rupee'
                },
                {
                  value: 'XPD',
                  label: 'Palladium'
                },
                {
                  value: 'MOP',
                  label: 'Pataca'
                },
                {
                  value: 'PHP',
                  label: 'Philippine Peso'
                },
                {
                  value: 'XPT',
                  label: 'Platinum'
                },
                {
                  value: 'GBP',
                  label: 'Pound Sterling'
                },
                {
                  value: 'BWP',
                  label: 'Pula'
                },
                {
                  value: 'QAR',
                  label: 'Qatari Rial'
                },
                {
                  value: 'GTQ',
                  label: 'Quetzal'
                },
                {
                  value: 'ZAR',
                  label: 'Rand'
                },
                {
                  value: 'OMR',
                  label: 'Rial Omani'
                },
                {
                  value: 'KHR',
                  label: 'Riel'
                },
                {
                  value: 'MVR',
                  label: 'Rufiyaa'
                },
                {
                  value: 'IDR',
                  label: 'Rupiah'
                },
                {
                  value: 'RUB',
                  label: 'Russian Ruble'
                },
                {
                  value: 'RWF',
                  label: 'Rwanda Franc'
                },
                {
                  value: 'XDR',
                  label: 'SDR'
                },
                {
                  value: 'SHP',
                  label: 'Saint Helena Pound'
                },
                {
                  value: 'SAR',
                  label: 'Saudi Riyal'
                },
                {
                  value: 'RSD',
                  label: 'Serbian Dinar'
                },
                {
                  value: 'SCR',
                  label: 'Seychelles Rupee'
                },
                {
                  value: 'XAG',
                  label: 'Silver'
                },
                {
                  value: 'SGD',
                  label: 'Singapore Dollar'
                },
                {
                  value: 'SBD',
                  label: 'Solomon Islands Dollar'
                },
                {
                  value: 'KGS',
                  label: 'Som'
                },
                {
                  value: 'SOS',
                  label: 'Somali Shilling'
                },
                {
                  value: 'TJS',
                  label: 'Somoni'
                },
                {
                  value: 'LKR',
                  label: 'Sri Lanka Rupee'
                },
                {
                  value: 'SDG',
                  label: 'Sudanese Pound'
                },
                {
                  value: 'SRD',
                  label: 'Surinam Dollar'
                },
                {
                  value: 'SEK',
                  label: 'Swedish Krona'
                },
                {
                  value: 'CHF',
                  label: 'Swiss Franc'
                },
                {
                  value: 'SYP',
                  label: 'Syrian Pound'
                },
                {
                  value: 'BDT',
                  label: 'Taka'
                },
                {
                  value: 'WST',
                  label: 'Tala'
                },
                {
                  value: 'TZS',
                  label: 'Tanzanian Shilling'
                },
                {
                  value: 'KZT',
                  label: 'Tenge'
                },
                {
                  value: 'TTD',
                  label: 'Trinidad and Tobago Dollar'
                },
                {
                  value: 'MNT',
                  label: 'Tugrik'
                },
                {
                  value: 'TND',
                  label: 'Tunisian Dinar'
                },
                {
                  value: 'TRY',
                  label: 'Turkish Lira'
                },
                {
                  value: 'TVD',
                  label: 'Tuvalu dollar'
                },
                {
                  value: 'AED',
                  label: 'UAE Dirham'
                },
                {
                  value: 'XFU',
                  label: 'UIC-Franc'
                },
                {
                  value: 'USD',
                  label: 'US Dollar'
                },
                {
                  value: 'UGX',
                  label: 'Uganda Shilling'
                },
                {
                  value: 'UYU',
                  label: 'Uruguayan peso'
                },
                {
                  value: 'UZS',
                  label: 'Uzbekistan Sum'
                },
                {
                  value: 'VUV',
                  label: 'Vatu'
                },
                {
                  value: 'KRW',
                  label: 'Won'
                },
                {
                  value: 'YER',
                  label: 'Yemeni Rial'
                },
                {
                  value: 'JPY',
                  label: 'Yen'
                },
                {
                  value: 'CNY',
                  label: 'Yuan Renminbi'
                },
                {
                  value: 'ZMK',
                  label: 'Zambian Kwacha'
                },
                {
                  value: 'ZMW',
                  label: 'Zambian Kwacha'
                },
                {
                  value: 'ZWD',
                  label: 'Zimbabwe Dollar A/06'
                },
                {
                  value: 'ZWN',
                  label: 'Zimbabwe dollar A/08'
                },
                {
                  value: 'ZWL',
                  label: 'Zimbabwe dollar A/09'
                },
                {
                  value: 'PLN',
                  label: 'Zloty'
                }
              ]
            },
            read_only: false
          },
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
          {
            key: 'date',
            type: 'datepicker',
            templateOptions: {
              required: false,
              label: 'Creation date',
              type: 'date'
            },
            read_only: true
          }
        ]
      }
    ]
  },
  {
    endpoint: '/core/invoicelines/',
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

const formadd = [
  {
    label: '{customer_company.__str__} - {date}',
    type: 'row',
    children: [
      {
        type: 'column',
        children: [
          {
            list: false,
            endpoint: '/core/companies/',
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
            endpoint: '/core/companycontacts/',
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
            endpoint: '/core/companies/',
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
          {
            key: 'currency',
            default: 'AUD',
            type: 'select',
            templateOptions: {
              required: false,
              label: 'Currency',
              type: 'select',
              options: [
                {
                  value: 'AFN',
                  label: 'Afghani'
                },
                {
                  value: 'DZD',
                  label: 'Algerian Dinar'
                },
                {
                  value: 'ARS',
                  label: 'Argentine Peso'
                },
                {
                  value: 'AMD',
                  label: 'Armenian Dram'
                },
                {
                  value: 'AWG',
                  label: 'Aruban Guilder'
                },
                {
                  value: 'AUD',
                  label: 'Australian Dollar'
                },
                {
                  value: 'AZN',
                  label: 'Azerbaijanian Manat'
                },
                {
                  value: 'BSD',
                  label: 'Bahamian Dollar'
                },
                {
                  value: 'BHD',
                  label: 'Bahraini Dinar'
                },
                {
                  value: 'THB',
                  label: 'Baht'
                },
                {
                  value: 'BBD',
                  label: 'Barbados Dollar'
                },
                {
                  value: 'BYR',
                  label: 'Belarussian Ruble'
                },
                {
                  value: 'BZD',
                  label: 'Belize Dollar'
                },
                {
                  value: 'BMD',
                  label:
                    'Bermudian Dollar (customarily known as Bermuda Dollar)'
                },
                {
                  value: 'BTN',
                  label: 'Bhutanese ngultrum'
                },
                {
                  value: 'VEF',
                  label: 'Bolivar Fuerte'
                },
                {
                  value: 'XBA',
                  label: 'Bond Markets Units European Composite Unit (EURCO)'
                },
                {
                  value: 'BRL',
                  label: 'Brazilian Real'
                },
                {
                  value: 'BND',
                  label: 'Brunei Dollar'
                },
                {
                  value: 'BGN',
                  label: 'Bulgarian Lev'
                },
                {
                  value: 'BIF',
                  label: 'Burundi Franc'
                },
                {
                  value: 'XOF',
                  label: 'CFA Franc BCEAO'
                },
                {
                  value: 'XAF',
                  label: 'CFA franc BEAC'
                },
                {
                  value: 'XPF',
                  label: 'CFP Franc'
                },
                {
                  value: 'CAD',
                  label: 'Canadian Dollar'
                },
                {
                  value: 'CVE',
                  label: 'Cape Verde Escudo'
                },
                {
                  value: 'KYD',
                  label: 'Cayman Islands Dollar'
                },
                {
                  value: 'CLP',
                  label: 'Chilean peso'
                },
                {
                  value: 'XTS',
                  label: 'Codes specifically reserved for testing purposes'
                },
                {
                  value: 'COP',
                  label: 'Colombian peso'
                },
                {
                  value: 'KMF',
                  label: 'Comoro Franc'
                },
                {
                  value: 'CDF',
                  label: 'Congolese franc'
                },
                {
                  value: 'BAM',
                  label: 'Convertible Marks'
                },
                {
                  value: 'NIO',
                  label: 'Cordoba Oro'
                },
                {
                  value: 'CRC',
                  label: 'Costa Rican Colon'
                },
                {
                  value: 'HRK',
                  label: 'Croatian Kuna'
                },
                {
                  value: 'CUP',
                  label: 'Cuban Peso'
                },
                {
                  value: 'CUC',
                  label: 'Cuban convertible peso'
                },
                {
                  value: 'CZK',
                  label: 'Czech Koruna'
                },
                {
                  value: 'GMD',
                  label: 'Dalasi'
                },
                {
                  value: 'DKK',
                  label: 'Danish Krone'
                },
                {
                  value: 'MKD',
                  label: 'Denar'
                },
                {
                  value: 'DJF',
                  label: 'Djibouti Franc'
                },
                {
                  value: 'STD',
                  label: 'Dobra'
                },
                {
                  value: 'DOP',
                  label: 'Dominican Peso'
                },
                {
                  value: 'VND',
                  label: 'Dong'
                },
                {
                  value: 'XCD',
                  label: 'East Caribbean Dollar'
                },
                {
                  value: 'EGP',
                  label: 'Egyptian Pound'
                },
                {
                  value: 'ETB',
                  label: 'Ethiopian Birr'
                },
                {
                  value: 'EUR',
                  label: 'Euro'
                },
                {
                  value: 'XBB',
                  label: 'European Monetary Unit (E.M.U.-6)'
                },
                {
                  value: 'XBD',
                  label: 'European Unit of Account 17(E.U.A.-17)'
                },
                {
                  value: 'XBC',
                  label: 'European Unit of Account 9(E.U.A.-9)'
                },
                {
                  value: 'FKP',
                  label: 'Falkland Islands Pound'
                },
                {
                  value: 'FJD',
                  label: 'Fiji Dollar'
                },
                {
                  value: 'HUF',
                  label: 'Forint'
                },
                {
                  value: 'GHS',
                  label: 'Ghana Cedi'
                },
                {
                  value: 'GIP',
                  label: 'Gibraltar Pound'
                },
                {
                  value: 'XAU',
                  label: 'Gold'
                },
                {
                  value: 'XFO',
                  label: 'Gold-Franc'
                },
                {
                  value: 'PYG',
                  label: 'Guarani'
                },
                {
                  value: 'GNF',
                  label: 'Guinea Franc'
                },
                {
                  value: 'GYD',
                  label: 'Guyana Dollar'
                },
                {
                  value: 'HTG',
                  label: 'Haitian gourde'
                },
                {
                  value: 'HKD',
                  label: 'Hong Kong Dollar'
                },
                {
                  value: 'UAH',
                  label: 'Hryvnia'
                },
                {
                  value: 'ISK',
                  label: 'Iceland Krona'
                },
                {
                  value: 'INR',
                  label: 'Indian Rupee'
                },
                {
                  value: 'IRR',
                  label: 'Iranian Rial'
                },
                {
                  value: 'IQD',
                  label: 'Iraqi Dinar'
                },
                {
                  value: 'IMP',
                  label: 'Isle of Man pount'
                },
                {
                  value: 'JMD',
                  label: 'Jamaican Dollar'
                },
                {
                  value: 'JOD',
                  label: 'Jordanian Dinar'
                },
                {
                  value: 'KES',
                  label: 'Kenyan Shilling'
                },
                {
                  value: 'PGK',
                  label: 'Kina'
                },
                {
                  value: 'LAK',
                  label: 'Kip'
                },
                {
                  value: 'KWD',
                  label: 'Kuwaiti Dinar'
                },
                {
                  value: 'AOA',
                  label: 'Kwanza'
                },
                {
                  value: 'MMK',
                  label: 'Kyat'
                },
                {
                  value: 'GEL',
                  label: 'Lari'
                },
                {
                  value: 'LVL',
                  label: 'Latvian Lats'
                },
                {
                  value: 'LBP',
                  label: 'Lebanese Pound'
                },
                {
                  value: 'ALL',
                  label: 'Lek'
                },
                {
                  value: 'HNL',
                  label: 'Lempira'
                },
                {
                  value: 'SLL',
                  label: 'Leone'
                },
                {
                  value: 'LSL',
                  label: 'Lesotho loti'
                },
                {
                  value: 'LRD',
                  label: 'Liberian Dollar'
                },
                {
                  value: 'LYD',
                  label: 'Libyan Dinar'
                },
                {
                  value: 'SZL',
                  label: 'Lilangeni'
                },
                {
                  value: 'LTL',
                  label: 'Lithuanian Litas'
                },
                {
                  value: 'MGA',
                  label: 'Malagasy Ariary'
                },
                {
                  value: 'MWK',
                  label: 'Malawian Kwacha'
                },
                {
                  value: 'MYR',
                  label: 'Malaysian Ringgit'
                },
                {
                  value: 'TMM',
                  label: 'Manat'
                },
                {
                  value: 'MUR',
                  label: 'Mauritius Rupee'
                },
                {
                  value: 'MZN',
                  label: 'Metical'
                },
                {
                  value: 'MXN',
                  label: 'Mexican peso'
                },
                {
                  value: 'MDL',
                  label: 'Moldovan Leu'
                },
                {
                  value: 'MAD',
                  label: 'Moroccan Dirham'
                },
                {
                  value: 'NGN',
                  label: 'Naira'
                },
                {
                  value: 'ERN',
                  label: 'Nakfa'
                },
                {
                  value: 'NAD',
                  label: 'Namibian Dollar'
                },
                {
                  value: 'NPR',
                  label: 'Nepalese Rupee'
                },
                {
                  value: 'ANG',
                  label: 'Netherlands Antillian Guilder'
                },
                {
                  value: 'ILS',
                  label: 'New Israeli Sheqel'
                },
                {
                  value: 'RON',
                  label: 'New Leu'
                },
                {
                  value: 'TWD',
                  label: 'New Taiwan Dollar'
                },
                {
                  value: 'NZD',
                  label: 'New Zealand Dollar'
                },
                {
                  value: 'KPW',
                  label: 'North Korean Won'
                },
                {
                  value: 'NOK',
                  label: 'Norwegian Krone'
                },
                {
                  value: 'PEN',
                  label: 'Nuevo Sol'
                },
                {
                  value: 'MRO',
                  label: 'Ouguiya'
                },
                {
                  value: 'TOP',
                  label: 'Paanga'
                },
                {
                  value: 'PKR',
                  label: 'Pakistan Rupee'
                },
                {
                  value: 'XPD',
                  label: 'Palladium'
                },
                {
                  value: 'MOP',
                  label: 'Pataca'
                },
                {
                  value: 'PHP',
                  label: 'Philippine Peso'
                },
                {
                  value: 'XPT',
                  label: 'Platinum'
                },
                {
                  value: 'GBP',
                  label: 'Pound Sterling'
                },
                {
                  value: 'BWP',
                  label: 'Pula'
                },
                {
                  value: 'QAR',
                  label: 'Qatari Rial'
                },
                {
                  value: 'GTQ',
                  label: 'Quetzal'
                },
                {
                  value: 'ZAR',
                  label: 'Rand'
                },
                {
                  value: 'OMR',
                  label: 'Rial Omani'
                },
                {
                  value: 'KHR',
                  label: 'Riel'
                },
                {
                  value: 'MVR',
                  label: 'Rufiyaa'
                },
                {
                  value: 'IDR',
                  label: 'Rupiah'
                },
                {
                  value: 'RUB',
                  label: 'Russian Ruble'
                },
                {
                  value: 'RWF',
                  label: 'Rwanda Franc'
                },
                {
                  value: 'XDR',
                  label: 'SDR'
                },
                {
                  value: 'SHP',
                  label: 'Saint Helena Pound'
                },
                {
                  value: 'SAR',
                  label: 'Saudi Riyal'
                },
                {
                  value: 'RSD',
                  label: 'Serbian Dinar'
                },
                {
                  value: 'SCR',
                  label: 'Seychelles Rupee'
                },
                {
                  value: 'XAG',
                  label: 'Silver'
                },
                {
                  value: 'SGD',
                  label: 'Singapore Dollar'
                },
                {
                  value: 'SBD',
                  label: 'Solomon Islands Dollar'
                },
                {
                  value: 'KGS',
                  label: 'Som'
                },
                {
                  value: 'SOS',
                  label: 'Somali Shilling'
                },
                {
                  value: 'TJS',
                  label: 'Somoni'
                },
                {
                  value: 'LKR',
                  label: 'Sri Lanka Rupee'
                },
                {
                  value: 'SDG',
                  label: 'Sudanese Pound'
                },
                {
                  value: 'SRD',
                  label: 'Surinam Dollar'
                },
                {
                  value: 'SEK',
                  label: 'Swedish Krona'
                },
                {
                  value: 'CHF',
                  label: 'Swiss Franc'
                },
                {
                  value: 'SYP',
                  label: 'Syrian Pound'
                },
                {
                  value: 'BDT',
                  label: 'Taka'
                },
                {
                  value: 'WST',
                  label: 'Tala'
                },
                {
                  value: 'TZS',
                  label: 'Tanzanian Shilling'
                },
                {
                  value: 'KZT',
                  label: 'Tenge'
                },
                {
                  value: 'TTD',
                  label: 'Trinidad and Tobago Dollar'
                },
                {
                  value: 'MNT',
                  label: 'Tugrik'
                },
                {
                  value: 'TND',
                  label: 'Tunisian Dinar'
                },
                {
                  value: 'TRY',
                  label: 'Turkish Lira'
                },
                {
                  value: 'TVD',
                  label: 'Tuvalu dollar'
                },
                {
                  value: 'AED',
                  label: 'UAE Dirham'
                },
                {
                  value: 'XFU',
                  label: 'UIC-Franc'
                },
                {
                  value: 'USD',
                  label: 'US Dollar'
                },
                {
                  value: 'UGX',
                  label: 'Uganda Shilling'
                },
                {
                  value: 'UYU',
                  label: 'Uruguayan peso'
                },
                {
                  value: 'UZS',
                  label: 'Uzbekistan Sum'
                },
                {
                  value: 'VUV',
                  label: 'Vatu'
                },
                {
                  value: 'KRW',
                  label: 'Won'
                },
                {
                  value: 'YER',
                  label: 'Yemeni Rial'
                },
                {
                  value: 'JPY',
                  label: 'Yen'
                },
                {
                  value: 'CNY',
                  label: 'Yuan Renminbi'
                },
                {
                  value: 'ZMK',
                  label: 'Zambian Kwacha'
                },
                {
                  value: 'ZMW',
                  label: 'Zambian Kwacha'
                },
                {
                  value: 'ZWD',
                  label: 'Zimbabwe Dollar A/06'
                },
                {
                  value: 'ZWN',
                  label: 'Zimbabwe dollar A/08'
                },
                {
                  value: 'ZWL',
                  label: 'Zimbabwe dollar A/09'
                },
                {
                  value: 'PLN',
                  label: 'Zloty'
                }
              ]
            },
            read_only: false
          },
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
          {
            key: 'date',
            type: 'datepicker',
            templateOptions: {
              required: false,
              label: 'Creation date',
              type: 'date'
            },
            read_only: true
          }
        ]
      }
    ]
  },
  {
    endpoint: '/core/invoicelines/',
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

export const metadata = {
  list,
  formset,
  form,
  formadd
};
