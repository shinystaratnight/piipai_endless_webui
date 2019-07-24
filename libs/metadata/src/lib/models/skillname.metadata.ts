const list = {
  list: {
    list: 'industry',
    label: 'Skill',
    columns: [
      {
        content: [
          {
            field: 'name',
            type: 'input'
          }
        ],
        name: 'name',
        sort_field: 'name',
        label: 'Skill Name',
        sort: true
      },
      {
        content: [
          {
            field: 'industry.type',
            type: 'input'
          }
        ],
        name: 'industry',
        sort_field: 'industry',
        label: 'Industry',
        sort: true
      }
    ],
    pagination_label: 'Skill',
    search_enabled: true,
    editDisable: false,
    filters: [
      {
        key: 'industry',
        label: 'Industry',
        data: {
          value: '__str__',
          endpoint: '/pricing/industries/',
          key: 'id'
        },
        query: 'industry',
        multiple: false,
        type: 'related'
      },
    ],
  },
  fields: [
    {
      key: 'type',
      type: 'input',
      templateOptions: {
        required: true,
        label: 'Type',
        type: 'text',
        max: 63
      },
      read_only: true
    },
    {
      type: 'related',
      send: false,
      endpoint: '/pricing/industries/',
      key: 'industry',
      reset: ['name'],
      templateOptions: {
        label: 'Industries',
        type: 'related',
        param: 'id',
        values: ['__str__']
      }
    },
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

export const metadata = {
  list,
  form,
  formadd
};
