const list = {
  list: {
    list: 'tag',
    label: 'Tag',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Tag'
      }
    ],
    pagination_label: 'Tag',
    search_enabled: true,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Tag',
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
    templateOptions: {
      required: true,
      label: 'Id',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Tag Name',
      max: 63,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'parent',
    type: 'related',
    endpoint: '/ecore/api/v2/core/tags/',
    hideIfNull: true,
    templateOptions: {
      values: ['__str__'],
      label: 'Parent',
      add: true,
      edit: true,
    },
    read_only: false
  },
  {
    key: 'children',
    many: true,
    type: 'related',
    endpoint: '/ecore/api/v2/core/tags/',
    saveRelated: {
      get: 'children',
      set: 'parent',
    },
    hideIfNull: true,
    templateOptions: {
      values: ['__str__'],
      label: 'Child',
      add: true,
      edit: true,
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
  },
  {
    key: 'evidence_required_for_approval',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Evidence required for approval',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'confidential',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Confidential',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'skills',
    many: true,
    type: 'related',
    endpoint: '/ecore/api/v2/skills/skilltags/',
    hideIfNull: true,
    doNotChoice: true,
    send: false,
    prefilled: {
      tag: '{id.id}'
    },
    templateOptions: {
      values: ['__str__'],
      label: 'Skills',
      delete: true,
      add: true,
      edit: true,
    },
    read_only: false
  },
];

const formadd = [
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Tag Name',
      max: 63,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'parent',
    type: 'related',
    endpoint: '/ecore/api/v2/core/tags/',
    templateOptions: {
      values: ['__str__'],
      add: true,
      label: 'Parent',
    },
    read_only: true
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
  },
  {
    key: 'evidence_required_for_approval',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Evidence required for approval',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'confidential',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Confidential',
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
