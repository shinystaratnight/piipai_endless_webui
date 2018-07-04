const list = {
  list: {
    list: 'ratecoefficientmodifier',
    label: 'Rate Coefficient Modifier',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Rate Coefficient Modifier'
      }
    ],
    pagination_label: 'Rate Coefficient Modifier',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'rate_coefficient',
        label: 'Rate coefficient',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/pricing/ratecoefficients/',
          key: 'id'
        },
        query: 'rate_coefficient'
      },
      {
        key: 'type',
        label: 'Type',
        options: [
          { value: 0, label: 'Company' },
          { value: 1, label: 'Candidate' }
        ],
        query: 'type',
        default: null,
        type: 'select'
      }
    ]
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Rate Coefficient Modifier',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
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
    key: 'type',
    type: 'select',
    templateOptions: {
      required: true,
      label: 'Type',
      type: 'select',
      options: [
        { value: 0, label: 'Company' },
        { value: 1, label: 'Candidate' }
      ]
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/pricing/ratecoefficients/',
    read_only: true,
    templateOptions: {
      label: 'Rate coefficient',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'rate_coefficient',
    many: false
  },
  {
    key: 'multiplier',
    default: 1.0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Multiplier',
      type: 'number',
      description: '1.00 = none'
    },
    read_only: false
  },
  {
    key: 'fixed_addition',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Fixed Addition',
      type: 'number',
      description: 'adds after multiplying when set'
    },
    read_only: false
  },
  {
    key: 'fixed_override',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Fixed Rate Override',
      type: 'number'
    },
    read_only: false
  }
];

const formadd = [
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
    key: 'type',
    type: 'select',
    templateOptions: {
      required: true,
      label: 'Type',
      type: 'select',
      options: [
        { value: 0, label: 'Company' },
        { value: 1, label: 'Candidate' }
      ]
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/pricing/ratecoefficients/',
    read_only: true,
    templateOptions: {
      label: 'Rate coefficient',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'rate_coefficient',
    many: false
  },
  {
    key: 'multiplier',
    default: 1.0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Multiplier',
      type: 'number',
      description: '1.00 = none'
    },
    read_only: false
  },
  {
    key: 'fixed_addition',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Fixed Addition',
      type: 'number',
      description: 'adds after multiplying when set'
    },
    read_only: false
  },
  {
    key: 'fixed_override',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Fixed Rate Override',
      type: 'number'
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
