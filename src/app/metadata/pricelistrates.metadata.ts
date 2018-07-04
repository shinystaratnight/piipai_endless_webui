const list = {
  list: {
    list: 'pricelistrate',
    label: 'Price List Rate',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Price List Rate'
      }
    ],
    pagination_label: 'Price List Rate',
    search_enabled: true,
    editDisable: false,
    filters: [
      {
        key: 'skill',
        label: 'Skill',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/skills/skills/',
          key: 'id'
        },
        query: 'skill'
      },
      {
        key: 'price_list',
        label: 'Price list',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/pricing/pricelists/',
          key: 'id'
        },
        query: 'price_list'
      }
    ]
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Price List Rate',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/pricing/pricelists/',
    read_only: true,
    templateOptions: {
      label: 'Price list',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'price_list',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: true,
    templateOptions: {
      label: 'Skill',
      add: true,
      delete: false,
      values: ['default_rate', '__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'skill',
    many: false
  },
  {
    key: 'hourly_rate',
    default: '{skill.default_rate}',
    type: 'input',
    templateOptions: { required: false, label: 'Hourly Rate', type: 'text' },
    read_only: false
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/pricing/pricelists/',
    read_only: true,
    templateOptions: {
      label: 'Price list',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'price_list',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: true,
    templateOptions: {
      label: 'Skill',
      add: true,
      delete: false,
      values: ['default_rate', '__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'skill',
    many: false
  },
  {
    key: 'hourly_rate',
    default: '{skill.default_rate}',
    type: 'input',
    templateOptions: { required: false, label: 'Hourly Rate', type: 'text' },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
