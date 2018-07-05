const list = {
  list: {
    list: 'acceptancetestanswer',
    label: 'Acceptance Test Answer',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Acceptance Test Answer'
      }
    ],
    pagination_label: 'Acceptance Test Answer',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Acceptance Test Answer',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
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
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestquestions/',
    read_only: true,
    templateOptions: {
      label: 'Acceptance test question',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'acceptance_test_question',
    many: false
  },
  {
    key: 'answer',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Answer',
      max: 255,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'order',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Order',
      max: 32767,
      type: 'number',
      min: -32768
    },
    read_only: false
  },
  {
    key: 'is_correct',
    default: false,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Is correct',
      type: 'checkbox'
    },
    read_only: false
  }
];

const formadd = [
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
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestquestions/',
    read_only: true,
    templateOptions: {
      label: 'Acceptance test question',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'acceptance_test_question',
    many: false
  },
  {
    key: 'answer',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Answer',
      max: 255,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'order',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Order',
      max: 32767,
      type: 'number',
      min: -32768
    },
    read_only: false
  },
  {
    key: 'is_correct',
    default: false,
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Is correct',
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
