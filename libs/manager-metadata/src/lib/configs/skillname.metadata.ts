import { createFilter, Type } from '@webui/metadata';
import { Endpoints } from '@webui/data';

// const list = {
//   list: {
//     list: 'industry',
//     label: 'Skill',
//     columns: [
//       {
//         content: [
//           {
//             field: 'name',
//             type: 'input'
//           }
//         ],
//         name: 'name',
//         sort_field: 'name',
//         label: 'Skill Name',
//         sort: true
//       },
//       {
//         content: [
//           {
//             field: 'industry.type',
//             type: 'input'
//           }
//         ],
//         name: 'industry',
//         sort_field: 'industry',
//         label: 'Industry',
//         sort: true
//       }
//     ],
//     pagination_label: 'Skill',
//     search_enabled: true,
//     editDisable: false,
//     filters: [
//       {
//         key: 'industry',
//         label: 'Industry',
//         data: {
//           value: '__str__',
//           endpoint: '/pricing/industries/',
//           key: 'id'
//         },
//         query: 'industry',
//         multiple: false,
//         type: 'related'
//       },
//     ],
//   },
//   fields: [
//     {
//       key: 'type',
//       type: 'input',
//       templateOptions: {
//         required: true,
//         label: 'Type',
//         type: 'text',
//         max: 63
//       },
//       read_only: true
//     },
//     {
//       type: 'related',
//       send: false,
//       endpoint: '/pricing/industries/',
//       key: 'industry',
//       reset: ['name'],
//       templateOptions: {
//         label: 'Industries',
//         type: 'related',
//         param: 'id',
//         values: ['__str__']
//       }
//     },
//   ]
// };

const filters = {
  active: createFilter(Type.Select, {
    key: 'active',
    label: 'Active',
    values: [
      {
        value: 'True',
        label: 'True'
      },
      {
        value: 'False',
        label: 'False'
      }
    ]
  }),
  industry: createFilter(Type.Relared, {
    endpoint: Endpoints.Industry,
    key: 'industry',
    label: 'Industry',
  })
}

const list = {
  list: {
    list: 'skill',
    label: 'Skill',
    update: {
      endpoint: '/skills/skills/{skill_id}/change_default/',
      fields: ['active', 'default_rate', 'price_list_default_rate']
    },
    create: {
      exist: 'skill_id',
      endpoint: '/skills/skills/',
      fields: {
        name: 'id',
        industry: 'industry.id',
        company: 'currentCompany',
        active: false
      }
    },
    columns: [
      {
        delim: null,
        label: 'Skill Name',
        sort: true,
        width: 150,
        content: [
          {
            field: 'name',
            type: 'text'
          }
        ],
        name: 'name',
        title: null,
        sort_field: 'name'
      },
      {
        delim: null,
        label: 'Industry',
        content: [
          {
            field: 'industry.type',
            type: 'text'
          }
        ],
        name: 'name.industry',
        title: null,
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
        label: 'Candidate pay rate default',
        content: [
          {
            field: 'default_rate',
            type: 'form',
            form: {
              key: 'default_rate',
              type: 'input',
              templateOptions: {
                type: 'number',
                display: '${default_rate}/h'
              },
            },
          }
        ],
        name: 'default_rate',
      },
      {
        delim: null,
        label: 'Client charge rate default',
        content: [
          {
            field: 'price_list_default_rate',
            type: 'form',
            form: {
              key: 'price_list_default_rate',
              type: 'input',
              templateOptions: {
                type: 'number',
                display: '${price_list_default_rate}/h'
              },
            },
          }
        ],
        purpose: ['hire'],
        name: 'price_list_default_rate',
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
    editEndpoint: Endpoints.Skill,
    canEdit: 'skill_id',
    filters: [
      filters.active,
      filters.industry
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
    type: 'related',
    endpoint: '/pricing/industries/',
    key: 'industry',
    read_only: true,
    templateOptions: {
      label: 'Industry',
      type: 'related',
      param: 'id',
      values: ['__str__']
    }
  },
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Skill Name',
      type: 'text',
      max: 63
    },
    read_only: false
  },
];

const formadd = [
  {
    type: 'related',
    endpoint: '/pricing/industries/',
    key: 'industry',
    templateOptions: {
      label: 'Industry',
      type: 'related',
      param: 'id',
      values: ['__str__']
    }
  },
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Skill Name',
      type: 'text',
      max: 255
    },
  },
];

export const skillname = {
  list,
  form,
  formadd
};
