import { Endpoints } from '@webui/data';

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
          endpoint: '/skills/skills/',
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
          endpoint: '/pricing/pricelists/',
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

const pricelist = {
  fields: [
    {
      key: 'hourly_rate',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Hourly Rate',
        type: 'number'
      },
      type: 'input'
    },
    {
      many: false,
      key: 'skill',
      endpoint: '/skills/skills/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__', 'tranlsations'],
        label: 'Skill',
        type: 'related'
      },
      read_only: true,
      type: 'related'
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
    }
  ],
  list: {
    columns: [
      {
        name: 'skill',
        sort: true,
        sort_field: 'skill',
        content: [
          {
            endpoint: '/skills/skills/',
            type: 'related',
            field: 'skill'
          }
        ],
        label: 'Skill'
      },
      {
        name: 'hourly_rate',
        sort: true,
        sort_field: 'hourly_rate',
        content: [{ type: 'input', field: 'hourly_rate' }],
        label: 'Hourly Rate'
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            endpoint: '/pricing/pricelistrates/{id}',
            icon: 'fa-pencil-alt',
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
    buttons: [],
    list: 'pricelistrate',
    editDisable: false,
    label: 'Price List Rate',
    pagination_label: 'Price List Rate',
    search_enabled: true
  }
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
    endpoint: '/pricing/pricelists/',
    visibleMode: true,
    read_only: true,
    templateOptions: {
      label: 'Price list',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    key: 'price_list',
  },
  {
    endpoint: '/skills/skills/',
    read_only: true,
    templateOptions: {
      label: 'Skill',
      add: true,
      delete: false,
      values: ['default_rate', '__str__', 'tranlsations'],
      type: 'related',
      edit: true
    },
    type: 'related',
    key: 'skill',
  },
  {
    key: 'hourly_rate',
    default: '{skill.default_rate}',
    useValue: true,
    updated: ['skill'],
    type: 'input',
    templateOptions: { required: false, label: 'Hourly Rate', type: 'text' },
    read_only: false
  },
  {
    endpoint: Endpoints.PriceListRateModifiers,
    type: 'list',
    templateOptions: {
      label: 'Price List Rate Modifier',
      type: 'list',
      text: 'Price List Rate Modifier',
      add_label: 'Add'
    },
    collapsed: false,
    prefilled: {
      price_list_rate: '{id}',
    },
    query: {
      price_list_rate: '{id}',
    }
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/pricing/pricelists/',
    visibleMode: true,
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
    endpoint: '/skills/skills/',
    read_only: true,
    templateOptions: {
      required: true,
      label: 'Skill',
      add: true,
      delete: false,
      values: ['price_list_default_rate', '__str__', 'tranlsations'],
      type: 'related',
      edit: true
    },
    query: {
      active: true,
      exclude_pricelist: '{price_list.id}'
    },
    collapsed: false,
    type: 'related',
    key: 'skill',
    many: false
  },
  {
    key: 'hourly_rate',
    default: '{skill.price_list_default_rate}',
    updated: ['skill'],
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Hourly Rate',
      type: 'text'
    },
    read_only: false
  }
];

const pricelistForm = [
  {
    type: 'related',
    read_only: true,
    collapsed: false,
    list: false,
    templateOptions: {
      type: 'related',
      add: true,
      edit: true,
      values: ['__str__'],
      label: 'Price list',
      delete: false
    },
    visibleMode: true,
    endpoint: '/pricing/pricelists/',
    key: 'price_list',
    many: false
  },
  {
    type: 'related',
    read_only: true,
    collapsed: false,
    list: false,
    templateOptions: {
      type: 'related',
      add: true,
      edit: true,
      values: ['default_rate', '__str__', 'tranlsations'],
      label: 'Skill',
      delete: false
    },
    endpoint: '/skills/skills/',
    key: 'skill',
    many: false
  },
  {
    type: 'input',
    templateOptions: {
      type: 'text',
      required: false,
      label: 'Hourly Rate'
    },
    read_only: false,
    default: '{skill.default_rate}',
    key: 'hourly_rate'
  }
];

export const pricelistrates = {
  list,
  pricelist,
  pricelistForm,
  form,
  formadd
};
