const list = {
  list: {
    list: 'user',
    label: 'User',
    columns: [
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/contacts/',
            field: 'contact',
            type: 'related'
          }
        ],
        name: 'contact',
        sort_field: 'contact',
        label: 'Contact',
        sort: true
      },
      {
        content: [
          {
            field: 'contact.email',
            type: 'input'
          }
        ],
        name: 'contact.email',
        sort_field: 'contact.email',
        label: 'E-mail',
        sort: true
      },
      {
        content: [
          {
            field: 'contact.phone_mobile',
            type: 'input'
          }
        ],
        name: 'contact.phone_mobile',
        sort_field: 'contact.phone_mobile',
        label: 'Mobile Phone',
        sort: true
      },
      {
        content: [
          {
            field: 'date_joined',
            type: 'datepicker'
          }
        ],
        name: 'date_joined',
        sort_field: 'date_joined',
        label: 'Date joined',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/auth/{id}/loginas/',
            field: 'id',
            action: 'emptyPost',
            type: 'button',
            label: 'Login as',
            text: 'Login',
            redirect: '/'
          }
        ],
        name: 'login_as',
        title: null,
        label: 'Login as',
        delim: null
      }
    ],
    pagination_label: 'User',
    search_enabled: true,
    editDisable: false
  },
  fields: [
    {
      key: 'id',
      type: 'button',
      templateOptions: {
        action: 'emptyPost',
        label: 'Login as',
        type: 'button',
        text: 'Login'
      },
      read_only: true
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/core/contacts/',
      read_only: true,
      templateOptions: {
        label: 'Contact',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'contact',
      many: false
    },
    {
      key: 'date_joined',
      default: '2018-07-04T09:43:21.930065Z',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Date joined',
        type: 'datetime'
      },
      read_only: true
    },
    {
      key: 'contact.phone_mobile',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Mobile Phone',
        type: 'text'
      },
      read_only: true
    },
    {
      key: 'contact.email',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'E-mail',
        type: 'email',
        max: 255
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/core/contacts/',
    read_only: true,
    templateOptions: {
      label: 'Contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'contact',
    many: false
  },
  {
    key: 'date_joined',
    default: '2018-07-04T09:44:49.807046Z',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Date joined',
      type: 'datetime'
    },
    read_only: true
  },
  {
    endpoint: '/ecore/api/v2/company-settings/globalpermissions/',
    templateOptions: {
      label: 'Global Permissions',
      type: 'list',
      text: 'Global Permissions'
    },
    collapsed: false,
    prefilled: {
      user: '{id}'
    },
    type: 'list',
    query: {
      user: '{id}'
    }
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/core/contacts/',
    read_only: true,
    templateOptions: {
      label: 'Contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'contact',
    many: false
  },
  {
    key: 'date_joined',
    default: '2018-07-04T09:45:11.622691Z',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Date joined',
      type: 'datetime'
    },
    read_only: true
  },
  {
    endpoint: '/ecore/api/v2/company-settings/globalpermissions/',
    templateOptions: {
      label: 'Global Permissions',
      type: 'list',
      text: 'Global Permissions'
    },
    collapsed: false,
    prefilled: {
      user: '{id}'
    },
    type: 'list',
    query: {
      user: '{id}'
    }
  }
];

export const metadata = {
  list,
  form,
  formadd
};
