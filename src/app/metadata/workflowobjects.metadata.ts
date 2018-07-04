const list = {
  list: {
    list: 'workflowobject',
    label: 'Workflow object',
    columns: [
      {
        content: [
          {
            field: 'state_name',
            type: 'static'
          }
        ],
        name: 'state_name',
        label: 'State name'
      },
      {
        content: [
          {
            field: 'comment',
            type: 'input'
          }
        ],
        name: 'comment',
        sort_field: 'comment',
        label: 'Comments',
        sort: true
      },
      {
        content: [
          {
            field: 'active',
            type: 'checkbox'
          }
        ],
        name: 'active',
        sort_field: 'active',
        label: 'Active',
        sort: true
      }
    ],
    pagination_label: 'Workflow object',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'object_id',
        label: 'Object id',
        type: 'text',
        default: null
      },
      {
        key: 'active',
        label: 'Active',
        options: [
          {
            value: 'True',
            label: 'Yes'
          },
          {
            value: 'False',
            label: 'No'
          }
        ],
        query: 'active',
        default: null,
        type: 'checkbox'
      },
      {
        key: 'state.workflow.name',
        label: 'Name',
        type: 'text',
        default: null
      }
    ]
  },
  fields: [
    {
      key: 'active',
      default: true,
      type: 'checkbox',
      templateOptions: {
        required: false,
        label: 'Active',
        type: 'checkbox'
      },
      read_only: true
    },
    {
      key: 'state_name',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'State name',
        type: 'static'
      },
      read_only: true
    },
    {
      key: 'comment',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Comments',
        description: 'State Change Comment',
        type: 'text'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    key: 'object_id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: true,
      label: 'Object id',
      type: 'text',
      description: 'ID of Object belonging to model in Workflow'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/workflownodes/',
    read_only: false,
    templateOptions: {
      label: 'State',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'state',
    many: false
  },
  {
    key: 'comment',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Comments',
      type: 'textarea',
      description: 'State Change Comment'
    },
    read_only: false
  },
  {
    key: 'active',
    default: true,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Active',
      type: 'checkbox'
    },
    read_only: false
  }
];

const formadd = [
  {
    key: 'object_id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: true,
      label: 'Object id',
      type: 'text',
      description: 'ID of Object belonging to model in Workflow'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/workflownodes/',
    read_only: false,
    templateOptions: {
      label: 'State',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'state',
    many: false
  },
  {
    key: 'comment',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Comments',
      type: 'textarea',
      description: 'State Change Comment'
    },
    read_only: false
  },
  {
    key: 'active',
    default: true,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Active',
      type: 'checkbox'
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
