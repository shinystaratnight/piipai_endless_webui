const list = {
  list: {
    list: 'pricelist',
    label: 'Price List',
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
        delim: null,
        label: 'Valid From',
        sort: true,
        content: [
          {
            field: 'valid_from',
            type: 'datepicker'
          }
        ],
        name: 'valid_from',
        title: null,
        sort_field: 'valid_from'
      },
      {
        delim: null,
        label: 'Valid Until',
        sort: true,
        content: [
          {
            field: 'valid_until',
            type: 'datepicker'
          }
        ],
        name: 'valid_until',
        title: null,
        sort_field: 'valid_until'
      },
      {
        content: [
          {
            field: 'effective',
            type: 'checkbox'
          }
        ],
        name: 'effective',
        sort_field: 'effective',
        label: 'Effective',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            field: 'approved_by',
            type: 'related'
          }
        ],
        name: 'approved_by',
        sort_field: 'approved_by',
        label: 'Approved by',
        sort: true
      },
      {
        content: [
          {
            field: 'approved_at',
            type: 'datepicker'
          }
        ],
        name: 'approved_at',
        sort_field: 'approved_at',
        label: 'Approved At',
        sort: true
      }
    ],
    pagination_label: 'Price List',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'company',
        label: 'Company',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companies/',
          key: 'id'
        },
        query: 'company'
      }
    ]
  },
  fields: [
    {
      key: 'approved_at',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Approved At',
        type: 'datetime'
      },
      read_only: true
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
      key: 'valid_from',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Valid From',
        type: 'date'
      },
      read_only: true
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/core/companycontacts/',
      read_only: true,
      templateOptions: {
        label: 'Approved by',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'approved_by',
      many: false
    },
    {
      key: 'effective',
      default: false,
      type: 'checkbox',
      templateOptions: {
        required: false,
        label: 'Effective',
        type: 'checkbox'
      },
      read_only: true
    },
    {
      key: 'valid_until',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Valid Until',
        type: 'date'
      },
      read_only: true
    }
  ]
};

const form = [
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
    key: 'valid_from',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Valid From',
      type: 'date'
    },
    read_only: false
  },
  {
    key: 'valid_until',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Valid Until',
      type: 'date'
    },
    read_only: false
  },
  {
    key: 'effective',
    default: false,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Effective',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Approved by',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'approved_by',
    many: false
  },
  {
    key: 'approved_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Approved At',
      type: 'datetime'
    },
    read_only: false
  },
  {
    endpoint: '/ecore/api/v2/pricing/pricelistrates/',
    metadata_query: {
      editable_type: 'pricelist'
    },
    templateOptions: {
      label: 'Price List Rates',
      type: 'list',
      add_label: 'Add',
      text: 'Price List Rates'
    },
    collapsed: false,
    prefilled: {
      price_list: '{id}'
    },
    type: 'list',
    query: {
      price_list: '{id}'
    }
  }
];

const formadd = [
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
    key: 'valid_from',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Valid From',
      type: 'date'
    },
    read_only: false
  },
  {
    key: 'valid_until',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Valid Until',
      type: 'date'
    },
    read_only: false
  },
  {
    key: 'effective',
    default: false,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Effective',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Approved by',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'approved_by',
    many: false
  },
  {
    key: 'approved_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Approved At',
      type: 'datetime'
    },
    read_only: false
  },
  {
    endpoint: '/ecore/api/v2/pricing/pricelistrates/',
    metadata_query: {
      editable_type: 'pricelist'
    },
    templateOptions: {
      label: 'Price List Rates',
      type: 'list',
      add_label: 'Add',
      text: 'Price List Rates'
    },
    collapsed: false,
    prefilled: {
      price_list: '{id}'
    },
    type: 'list',
    query: {
      price_list: '{id}'
    }
  }
];

export const metadata = {
  list,
  form,
  formadd
};
