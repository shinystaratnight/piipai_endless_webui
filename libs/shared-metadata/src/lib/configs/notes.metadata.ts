const list = {
  list: {
    list: 'note',
    label: 'Contact Note',
    buttons: [],
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Contact Note'
      }
    ],
    pagination_label: 'Contact Note',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Contact Note',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const formset = {
  fields: [
    {
      key: 'created_by',
      read_only: true,
      templateOptions: { required: false, label: 'Created by', type: 'static' },
      type: 'static'
    },
    {
      key: 'id',
      templateOptions: {
        action: 'delete',
        label: '',
        type: 'button',
        text: ''
      },
      type: 'button'
    },
    {
      key: 'note',
      read_only: false,
      templateOptions: { required: false, label: 'Notes', type: 'text' },
      type: 'input'
    },
    {
      key: 'updated_at',
      read_only: true,
      templateOptions: {
        required: false,
        label: 'Updated at',
        type: 'datetime'
      },
      type: 'datepicker'
    },
    {
      key: 'updated_by',
      read_only: true,
      templateOptions: { required: false, label: 'Updated by', type: 'static' },
      type: 'static'
    },
    {
      key: 'created_at',
      read_only: true,
      templateOptions: {
        required: false,
        label: 'Created at',
        type: 'datetime'
      },
      type: 'datepicker'
    }
  ],
  list: {
    columns: [
      {
        name: 'note',
        sort: true,
        sort_field: 'note',
        content: [{ type: 'input', field: 'note' }],
        label: 'Notes'
      },
      {
        name: 'created',
        content: [
          { type: 'datepicker', field: 'created_at' },
          { type: 'static', field: 'created_by' }
        ],
        label: 'Created',
        title: null,
        delim: null
      },
      {
        name: 'updated',
        content: [
          { type: 'datepicker', field: 'updated_at' },
          { type: 'static', field: 'updated_by' }
        ],
        label: 'Updated',
        title: null,
        delim: null
      },
      {
        name: 'id',
        title: 'Edit',
        content: [
          {
            action: 'editForm',
            endpoint: '/core/notes/{id}',
            icon: 'fa-pencil-alt',
            title: 'Edit',
            text_color: '#f0ad4e',
            type: 'button',
            field: 'id'
          }
        ],
        label: '',
        delim: null
      },
      {
        name: 'id',
        title: 'Delete',
        content: [
          {
            action: 'delete',
            icon: 'fa-times-circle',
            title: 'Delete',
            text_color: '#f32700',
            type: 'button',
            field: 'id'
          }
        ],
        label: '',
        delim: null
      }
    ],
    list: 'note',
    editDisable: false,
    label: 'Contact Note',
    pagination_label: 'Contact Note',
    search_enabled: false
  }
};

const form = [
  {
    endpoint: '/contenttypes/contenttypes/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Content type',
      values: ['__str__']
    },
    type: 'related',
    key: 'content_type'
  },
  {
    key: 'object_id',
    type: 'input',
    hide: true,
    templateOptions: { required: true, label: 'Object id', type: 'text' },
    read_only: false
  },
  {
    key: 'note',
    type: 'textarea',
    templateOptions: {
      rows: 3,
      full: true,
      required: false,
      label: 'Notes',
      type: 'textarea'
    },
    read_only: false
  }
];

const formadd = [
  {
    endpoint: '/contenttypes/contenttypes/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Content type',
      values: ['__str__']
    },
    type: 'related',
    key: 'content_type'
  },
  {
    key: 'object_id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: true,
      label: 'Object id',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'note',
    type: 'textarea',
    templateOptions: {
      full: true,
      rows: 3,
      required: true,
      autofocus: true,
      type: 'textarea'
    },
    read_only: false
  }
];

const candidatepool = {
  fields: [
    {
      key: 'created_by',
      read_only: true,
      templateOptions: { required: false, label: 'Created by', type: 'static' },
      type: 'static'
    },
    {
      key: 'note',
      read_only: false,
      templateOptions: { required: false, label: 'Notes', type: 'text' },
      type: 'input'
    },
    {
      key: 'created_at',
      read_only: true,
      templateOptions: {
        required: false,
        label: 'Created at',
        type: 'datetime'
      },
      type: 'datepicker'
    }
  ],
  list: {
    columns: [
      {
        name: 'note',
        sort: true,
        sort_field: 'note',
        content: [{ type: 'input', field: 'note' }],
        label: 'Notes'
      },
      {
        name: 'created',
        content: [{ type: 'datepicker', field: 'created_at' }],
        label: 'Created',
        title: null,
        delim: null
      }
    ],
    list: 'note',
    editDisable: true,
    label: 'Contact Note',
    pagination_label: 'Contact Note',
    search_enabled: false
  }
};

export const notes = {
  list,
  formset,
  form,
  formadd,
  candidatepool
};
