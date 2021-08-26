import { Endpoints, SkillWorkTypeModel, Models } from '@webui/data';
import { Form, List } from '@webui/metadata';

const worktypeField = () =>
  new SkillWorkTypeModel()
    .formElement()
    .setPerfilledFields({
      [Models.Skill]: '{skill.id}'
    })
    .setShowIfRule(['skill.id'])
    .setActions({ add: true })
    .updateValues(['translations'])
    .setQuery({
      skill: '{skill.id}',
      all: true
    });

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
        values: ['__str__', 'tranlsations', 'name'],
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
      new List.column.element('worktype', 'Skill Activity').setContent([
        new List.text.element('worktype').setShowIfRule(['worktype']),
        new List.select.element('worktype')
          .setValues({ null: 'Default' })
          .setColors({ null: 'info' })
          .setShowIfRule([{ worktype: null }])
      ]),
      new List.column.element('rate', 'Rate')
        .setSort(true, 'rate')
        .setContent([new List.input.element('rate')]),
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
  new Form.related.element('company', 'Company', Endpoints.Company)
    .hideField()
    .doNotSend(),
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
    key: 'price_list'
  },
  new Form.related.element('skill', 'Skill', Endpoints.Skill)
    .setQuery({
      active: true
    })
    .updateValues(['price_list_default_rate', 'tranlsations', 'name']),
  {
    key: 'rate',
    default: '{skill.price_list_default_rate}',
    useValue: true,
    updated: ['skill'],
    type: 'input',
    templateOptions: { required: false, label: 'Hourly Rate', type: 'text' },
    read_only: false
  },
  worktypeField(),
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
      price_list_rate: '{id}'
    },
    query: {
      price_list_rate: '{id}'
    }
  }
];

const formadd = [
  new Form.related.element('company', 'Company', Endpoints.Company)
    .hideField()
    .doNotSend(),
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
  new Form.related.element('skill', 'Skill', Endpoints.Skill)
    .setQuery({
      active: true
    })
    .updateValues(['price_list_default_rate', 'tranlsations', 'name']),
  {
    key: 'rate',
    default: '{skill.price_list_default_rate}',
    updated: ['skill'],
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Rate',
      type: 'text'
    },
    read_only: false
  },
  worktypeField()
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
