const formset = {
  fields: [],
  list: {
    columns: [
      {
        name: 'tag',
        sort: true,
        sort_field: 'tag',
        content: [
          {
            endpoint: '/ecore/api/v2/core/tags/',
            type: 'related',
            field: 'tag'
          }
        ],
        label: 'Tag'
      },
      {
        name: 'actions',
        content: [
          {
            action: 'editForm',
            icon: 'fa-pencil',
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
    list: 'tagrel',
    editDisable: false,
    label: 'Tag Relationship',
    pagination_label: 'Tag Relationship',
    search_enabled: false
  }
};

const form = [
  {
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: true,
    templateOptions: {
      label: 'Skill',
      values: ['__str__'],
    },
    type: 'related',
    key: 'skill',
  },
  {
    endpoint: '/ecore/api/v2/core/tags/',
    read_only: true,
    templateOptions: {
      label: 'Tag',
      values: ['__str__'],
    },
    type: 'related',
    key: 'tag'
  }
];

const formadd = [
  {
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: true,
    templateOptions: {
      label: 'Skill',
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
    },
    type: 'related',
    key: 'skill',
  },
  {
    endpoint: '/ecore/api/v2/core/tags/',
    read_only: true,
    templateOptions: {
      label: 'Tag',
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
    },
    type: 'related',
    key: 'tag'
  }
];

export const metadata = {
  form,
  formadd,
  formset,
};
