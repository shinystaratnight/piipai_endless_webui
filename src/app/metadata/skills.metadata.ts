const list = {
  list: {
    list: 'skill',
    label: 'Skill',
    columns: [
      {
        delim: null,
        label: 'Skill Name',
        sort: true,
        content: [
          {
            field: 'name.name',
            type: 'text'
          }
        ],
        name: 'name',
        title: null,
        sort_field: 'name'
      },
      {
        delim: null,
        label: 'Active',
        sort: true,
        content: [
          {
            field: 'active',
            type: 'checkbox'
          }
        ],
        name: 'active',
        title: null,
        sort_field: 'active'
      },
      {
        delim: null,
        label: 'Carrier List Reserve',
        sort: true,
        content: [
          {
            field: 'carrier_list_reserve',
            type: 'text'
          }
        ],
        name: 'carrier_list_reserve',
        title: null,
        sort_field: 'carrier_list_reserve'
      }
    ],
    pagination_label: 'Skill',
    search_enabled: true,
    editDisable: false,
    filters: [
      {
        key: 'active',
        label: 'Active',
        options: [
          {
            value: 'True',
            label: 'True'
          },
          {
            value: 'False',
            label: 'False'
          }
        ],
        query: 'active',
        default: null,
        type: 'select'
      }
    ]
  },
  fields: [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        label: 'Skill Name',
        max: 63,
        type: 'text'
      },
      read_only: true
    },
    {
      key: 'active',
      default: true,
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Active',
        type: 'text'
      },
      read_only: true
    },
    {
      key: 'carrier_list_reserve',
      default: 0,
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Carrier List Reserve',
        max: 32767,
        type: 'text',
        min: 0
      },
      read_only: true
    }
  ]
};

const form = [
  {
    values: {
      available: 'active',
      company: 'name.industry',
      skill_title: 'name.name',
      created_at: 'created_at',
      updated_at: 'updated_at'
    },
    type: 'info',
    key: 'id'
  },
  {
    type: 'related',
    hide: true,
    read_only: true,
    endpoint: '/ecore/api/v2/pricing/industries/',
    key: 'name.industry',
    templateOptions: {
      label: 'Industries',
      type: 'related',
      param: 'id',
      values: ['__str__']
    }
  },
  {
    type: 'input',
    hide: true,
    read_only: true,
    key: 'name.name',
    templateOptions: {
      label: 'Skill name',
      type: 'text'
    }
  },
  {
    type: 'tabs',
    children: [
      {
        main: true,
        name: 'Skill Info',
        type: 'group',
        label: 'Skill information',
        children: [
          {
            type: 'row',
            children: [
              {
                label: 'Additional Info',
                type: 'group',
                children: [
                  {
                    key: 'short_name',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Short Name',
                      max: 15,
                      type: 'text',
                      description:
                        'Abbreviation, for use by staff reports and dashboards'
                    },
                    read_only: false
                  },
                  {
                    key: 'carrier_list_reserve',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Carrier list reserve',
                      type: 'number'
                    },
                    read_only: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/skills/employmentclassifications/',
                    read_only: false,
                    templateOptions: {
                      label: 'Employment classification',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    key: 'employment_classification',
                    many: false
                  }
                ],
                width: 0.34
              },
              {
                label: 'Skill Rate',
                type: 'group',
                children: [
                  {
                    key: 'lower_rate_limit',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Lower Rate Limit',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  },
                  {
                    key: 'default_rate',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Default Rate',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  },
                  {
                    key: 'upper_rate_limit',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Upper Rate Limit',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  }
                ],
                width: 0.33
              },
              {
                label: 'Price List Rate',
                type: 'group',
                children: [
                  {
                    key: 'price_list_lower_rate_limit',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Lower Rate Limit',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  },
                  {
                    key: 'price_list_default_rate',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Default Rate',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  },
                  {
                    key: 'price_list_upper_rate_limit',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Upper Rate Limit',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  }
                ],
                width: 0.33
              }
            ]
          }
        ]
      },
      {
        endpoint: '/ecore/api/v2/skills/skilltags/',
        templateOptions: {
          label: 'Skill tags',
          type: 'list',
          add_label: '+ Add item',
          text: 'Skill tags'
        },
        collapsed: false,
        prefilled: {
          skill: '{id}'
        },
        type: 'list',
        query: {
          skill: '{id}'
        },
        help: 'Here you can see the tags which belong to the skill'
      }
    ]
  },
  {
    key: 'active',
    read_only: false,
    templateOptions: {
      required: false,
      label: 'Active',
      type: 'checkbox'
    },
    hide: true,
    default: false,
    type: 'checkbox'
  },
  {
    key: 'name',
    type: 'input',
    hide: true,
    templateOptions: {
      required: true,
      label: 'Skill Name',
      max: 63,
      type: 'text'
    },
    read_only: false
  }
];

const formadd = [
  {
    values: {
      available: 'active',
      skill_title: 'name',
      created_at: 'created_at',
      carrier_reserve: 'carrier_list_reserve',
      updated_at: 'updated_at'
    },
    type: 'info',
    key: 'id'
  },
  {
    type: 'tabs',
    children: [
      {
        main: true,
        name: 'Skill Info',
        type: 'group',
        label: 'Skill information',
        children: [
          {
            type: 'row',
            children: [
              {
                label: 'Additional Info',
                type: 'group',
                children: [
                  {
                    key: 'short_name',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Short Name',
                      max: 15,
                      type: 'text',
                      description:
                        'Abbreviation, for use by staff reports and dashboards'
                    },
                    read_only: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/skills/employmentclassifications/',
                    read_only: false,
                    templateOptions: {
                      label: 'Employment classification',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    key: 'employment_classification',
                    many: false
                  }
                ],
                width: 0.34
              },
              {
                label: 'Skill Rate',
                type: 'group',
                children: [
                  {
                    key: 'lower_rate_limit',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Lower Rate Limit',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  },
                  {
                    key: 'default_rate',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Default Rate',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  },
                  {
                    key: 'upper_rate_limit',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Upper Rate Limit',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  }
                ],
                width: 0.33
              },
              {
                label: 'Price List Rate',
                type: 'group',
                children: [
                  {
                    key: 'price_list_lower_rate_limit',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Lower Rate Limit',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  },
                  {
                    key: 'price_list_default_rate',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Default Rate',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  },
                  {
                    key: 'price_list_upper_rate_limit',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Upper Rate Limit',
                      type: 'number',
                      display: '${field}/h'
                    },
                    read_only: false
                  }
                ],
                width: 0.33
              }
            ]
          }
        ]
      }
    ]
  },
  {
    key: 'active',
    read_only: false,
    templateOptions: {
      required: false,
      label: 'Active',
      type: 'checkbox'
    },
    hide: true,
    default: false,
    type: 'checkbox'
  },
  {
    key: 'name',
    type: 'input',
    hide: true,
    templateOptions: {
      required: true,
      label: 'Skill Name',
      max: 63,
      type: 'text'
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
