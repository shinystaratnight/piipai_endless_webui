const list = {
  list: {
    list: 'acceptancetestquestion',
    label: 'Acceptance Test Question',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Acceptance Test Question'
      }
    ],
    pagination_label: 'Acceptance Test Question',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Acceptance Test Question',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestanswers/',
    read_only: true,
    templateOptions: {
      label: 'Acceptance test answers',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'acceptance_test_answers',
    many: true
  },
  {
    key: 'acceptance_test_question_rels'
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
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Updated at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Created at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetests/',
    read_only: true,
    templateOptions: {
      label: 'Acceptance test',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'acceptance_test',
    many: false
  },
  {
    key: 'question',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Question',
      max: 255,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'details',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Details',
      type: 'text'
    },
    read_only: false
  }
];

const formadd = [
  {
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetests/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Acceptance test',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    key: 'acceptance_test',
  },
  {
    type: 'row',
    children: [
      {
        key: 'question',
        type: 'input',
        templateOptions: {
          required: true,
          label: 'Question',
          max: 255,
          type: 'text'
        }
      },
      {
        key: 'details',
        type: 'textarea',
        templateOptions: {
          required: false,
          label: 'Details',
        }
      },
      {
        key: 'type',
        type: 'select',
        templateOptions: {
          required: false,
          label: 'Question Type',
          options: [
            { value: 0, label: 'Options' },
            { value: 2, label: 'Yes/No' }
          ]
        }
      },
      {
        key: 'order',
        type: 'input',
        hide: true,
        templateOptions: {
          required: false,
          label: 'Order',
          type: 'number'
        }
      },
    ]
  }

  // {
  //   list: false,
  //   endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestanswers/',
  //   read_only: true,
  //   templateOptions: {
  //     label: 'Acceptance test answers',
  //     add: true,
  //     delete: false,
  //     values: ['__str__'],
  //     type: 'related',
  //     edit: true
  //   },
  //   collapsed: false,
  //   type: 'related',
  //   key: 'acceptance_test_answers',
  //   many: true
  // },
  // {
  //   key: 'acceptance_test_question_rels'
  // },
  // {
  //   key: 'id',
  //   type: 'input',
  //   hide: true,
  //   templateOptions: {
  //     required: false,
  //     label: 'Id',
  //     type: 'text'
  //   },
  //   read_only: false
  // },
  // {
  //   key: 'updated_at',
  //   type: 'datepicker',
  //   templateOptions: {
  //     required: false,
  //     label: 'Updated at',
  //     type: 'datetime'
  //   },
  //   read_only: true
  // },
  // {
  //   key: 'created_at',
  //   type: 'datepicker',
  //   templateOptions: {
  //     required: false,
  //     label: 'Created at',
  //     type: 'datetime'
  //   },
  //   read_only: true
  // },
  // {
  //   key: 'question',
  //   type: 'input',
  //   templateOptions: {
  //     required: true,
  //     label: 'Question',
  //     max: 255,
  //     type: 'text'
  //   },
  //   read_only: false
  // },
  // {
  //   key: 'details',
  //   type: 'input',
  //   templateOptions: {
  //     required: false,
  //     label: 'Details',
  //     type: 'text'
  //   },
  //   read_only: false
  // }
];

export const metadata = {
  list,
  form,
  formadd,
};
