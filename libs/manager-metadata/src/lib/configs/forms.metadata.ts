const list = {
  list: {
    list: 'form',
    label: 'Form',
    columns: [
      {
        content: [
          {
            field: 'id',
            type: 'input'
          }
        ],
        name: 'id',
        sort_field: 'id',
        label: 'Id',
        sort: true
      },
      // {
      //   content: [
      //     {
      //       field: 'title',
      //       type: 'input'
      //     }
      //   ],
      //   name: 'title',
      //   sort_field: 'title',
      //   label: 'Title',
      //   sort: true
      // },
      {
        content: [
          {
            endpoint: '/core/companies/',
            field: 'company',
            type: 'related'
          }
        ],
        name: 'company',
        sort_field: 'company',
        label: 'Company',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/core/formbuilders/',
            field: 'builder',
            type: 'related'
          }
        ],
        name: 'builder',
        sort_field: 'builder',
        label: 'Entity',
        sort: true
      },
      // {
      //   content: [
      //     {
      //       field: 'is_active',
      //       type: 'checkbox'
      //     }
      //   ],
      //   name: 'is_active',
      //   sort_field: 'is_active',
      //   label: 'Is active',
      //   sort: true
      // }
    ],
    pagination_label: 'Form',
    search_enabled: false,
    editDisable: false,
    buttons: [],
  },
  fields: [
    {
      list: false,
      endpoint: '/core/formbuilders/',
      read_only: true,
      templateOptions: {
        label: 'Entity',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'builder',
      many: false
    },
    // {
    //   key: 'is_active',
    //   default: false,
    //   type: 'checkbox',
    //   templateOptions: {
    //     required: false,
    //     label: 'Is active',
    //     type: 'checkbox'
    //   },
    //   read_only: true
    // },
    // {
    //   key: 'title',
    //   default: '',
    //   type: 'input',
    //   templateOptions: {
    //     required: false,
    //     label: 'Title',
    //     type: 'text',
    //     max: 1024
    //   },
    //   read_only: true
    // },
    {
      list: false,
      endpoint: '/core/companies/',
      read_only: true,
      templateOptions: {
        label: 'Company',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'company',
      many: false
    },
    {
      key: 'id',
      type: 'input',
      hide: true,
      templateOptions: {
        required: false,
        label: 'Id',
        type: 'text'
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
      required: false,
      label: 'Id',
      type: 'text'
    },
    read_only: false
  },
  // {
  //   key: 'title',
  //   default: '',
  //   type: 'input',
  //   templateOptions: {
  //     required: false,
  //     label: 'Title',
  //     max: 1024,
  //     type: 'text'
  //   },
  //   read_only: false
  // },
  {
    list: false,
    endpoint: '/core/companies/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'company',
    many: false
  },
  {
    list: false,
    endpoint: '/core/formbuilders/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Entity',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'builder',
    many: false
  },
  // {
  //   key: 'is_active',
  //   default: false,
  //   hide: true,
  //   type: 'checkbox',
  //   templateOptions: {
  //     required: false,
  //     label: 'Is active',
  //     type: 'checkbox'
  //   },
  //   read_only: false
  // },
  // {
  //   key: 'short_description',
  //   default: '',
  //   type: 'input',
  //   templateOptions: {
  //     required: false,
  //     label: 'Short description',
  //     type: 'text'
  //   },
  //   read_only: false
  // },
  // {
  //   key: 'save_button_text',
  //   default: 'Save',
  //   type: 'input',
  //   templateOptions: {
  //     required: false,
  //     label: 'Button text',
  //     max: 512,
  //     type: 'text'
  //   },
  //   read_only: false
  // },
  // {
  //   key: 'submit_message',
  //   default: '',
  //   type: 'textarea',
  //   templateOptions: {
  //     required: false,
  //     label: 'Result message',
  //     type: 'textarea',
  //     description: 'Would be used for display user message after saving'
  //   },
  //   read_only: false
  // },
  {
    endpoint: '/core/formfieldgroups/',
    read_only: false,
    templateOptions: {
      label: 'Groups',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    createOnly: true,
    type: 'fieldsGroup',
    key: 'groups',
  }
];

const formadd = [
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      label: 'Id',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'title',
    default: '',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Title',
      max: 1024,
      type: 'text'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/core/companies/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'company',
    many: false
  },
  {
    list: false,
    endpoint: '/core/formbuilders/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Entity',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'builder',
    many: false
  },
  // {
  //   key: 'is_active',
  //   default: false,
  //   hide: true,
  //   type: 'checkbox',
  //   templateOptions: {
  //     required: false,
  //     label: 'Is active',
  //     type: 'checkbox'
  //   },
  //   read_only: false
  // },
  {
    key: 'short_description',
    default: '',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Short description',
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'save_button_text',
    default: 'Save',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Button text',
      max: 512,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'submit_message',
    default: '',
    type: 'textarea',
    templateOptions: {
      required: false,
      label: 'Result message',
      type: 'textarea',
      description: 'Would be used for display user message after saving'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/core/formfieldgroups/',
    read_only: true,
    templateOptions: {
      label: 'Groups',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'groups',
    many: true
  }
];

export const forms = {
  list,
  form,
  formadd
};
