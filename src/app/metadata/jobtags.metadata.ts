const list = {
  fields: [
    {
      many: false,
      key: 'tag',
      endpoint: '/ecore/api/v2/core/tags/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Tag',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      many: false,
      key: 'job',
      endpoint: '/ecore/api/v2/hr/jobs/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Job',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    }
  ],
  list: {
    columns: [
      {
        name: 'job',
        sort: true,
        sort_field: 'job',
        content: [
          {
            endpoint: '/ecore/api/v2/hr/jobs/',
            type: 'related',
            field: 'job'
          }
        ],
        label: 'Job'
      },
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
      }
    ],
    filters: [
      {
        data: {
          key: 'id',
          endpoint: '/ecore/api/v2/hr/jobs/',
          value: '__str__'
        },
        key: 'job',
        label: 'Job',
        type: 'related',
        query: 'job'
      }
    ],
    list: 'jobtag',
    editDisable: false,
    label: 'Job Tag',
    pagination_label: 'Job Tag',
    search_enabled: false
  }
};

const form = [
  {
    hide: true,
    many: false,
    key: 'job',
    endpoint: '/ecore/api/v2/hr/jobs/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Job',
      type: 'related'
    },
    read_only: true,
    type: 'related'
  },
  {
    many: false,
    key: 'tag',
    endpoint: '/ecore/api/v2/core/tags/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Tag',
      type: 'related'
    },
    read_only: false,
    type: 'related'
  }
];

const formadd = [
  {
    hide: true,
    many: false,
    key: 'job',
    endpoint: '/ecore/api/v2/hr/jobs/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Job',
      type: 'related'
    },
    read_only: true,
    type: 'related'
  },
  {
    many: false,
    key: 'tag',
    endpoint: '/ecore/api/v2/core/tags/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Tag',
      type: 'related'
    },
    read_only: false,
    type: 'related'
  }
];

const formset = {
  fields: [
    {
      many: false,
      key: 'tag',
      endpoint: '/ecore/api/v2/core/tags/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Tag',
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
            endpoint: '/ecore/api/v2/hr/jobtags/{id}',
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
    list: 'jobtag',
    editDisable: false,
    label: 'Job Tag',
    pagination_label: 'Job Tag',
    search_enabled: false
  }
};

export const metadata = {
  list,
  form,
  formadd,
  formset
};
