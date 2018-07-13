const list = {
  fields: [
    {
      key: '__str__',
      type: 'static',
      read_only: true,
      templateOptions: {
        label: 'Acceptance Test',
        type: 'static',
        required: false
      }
    }
  ],
  list: {
    label: 'Acceptance Test',
    search_enabled: false,
    pagination_label: 'Acceptance Test',
    list: 'acceptancetest',
    columns: [
      {
        label: 'Acceptance Test',
        name: '__str__',
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ]
      }
    ],
    editDisable: false
  }
};

const form = [
  {
    collapsed: false,
    type: 'related',
    read_only: true,
    list: false,
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestskills/',
    key: 'acceptance_tests_skills',
    many: true,
    templateOptions: {
      label: 'Acceptance tests skills',
      type: 'related',
      edit: true,
      values: ['__str__'],
      delete: false,
      add: true
    }
  },
  {
    collapsed: false,
    type: 'related',
    read_only: true,
    list: false,
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestquestions/',
    key: 'acceptance_test_questions',
    many: true,
    templateOptions: {
      label: 'Acceptance test questions',
      type: 'related',
      edit: true,
      values: ['__str__'],
      delete: false,
      add: true
    }
  },
  {
    key: 'candidate_acceptance_tests'
  },
  {
    key: 'id',
    hide: true,
    type: 'input',
    read_only: false,
    templateOptions: {
      label: 'Id',
      type: 'text',
      required: false
    }
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    read_only: true,
    templateOptions: {
      label: 'Updated at',
      type: 'datetime',
      required: false
    }
  },
  {
    key: 'created_at',
    type: 'datepicker',
    read_only: true,
    templateOptions: {
      label: 'Created at',
      type: 'datetime',
      required: false
    }
  },
  {
    key: 'test_name',
    type: 'input',
    read_only: false,
    templateOptions: {
      label: 'Test Name',
      type: 'text',
      max: 255,
      required: true
    }
  },
  {
    key: 'description',
    type: 'input',
    read_only: false,
    templateOptions: {
      label: 'Description',
      type: 'text',
      required: false
    }
  },
  {
    key: 'valid_from',
    type: 'datepicker',
    read_only: false,
    templateOptions: {
      label: 'Valid From',
      type: 'date',
      required: true
    }
  },
  {
    key: 'valid_until',
    type: 'datepicker',
    read_only: false,
    templateOptions: {
      label: 'Valid Until',
      type: 'date',
      required: true
    }
  },
  {
    key: 'is_active',
    type: 'checkbox',
    read_only: false,
    default: false,
    templateOptions: {
      label: 'Active',
      type: 'checkbox',
      required: false
    }
  }
];

const formadd = [
  {
    collapsed: false,
    type: 'related',
    read_only: true,
    list: false,
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestskills/',
    key: 'acceptance_tests_skills',
    many: true,
    templateOptions: {
      label: 'Acceptance tests skills',
      type: 'related',
      edit: true,
      values: ['__str__'],
      delete: false,
      add: true
    }
  },
  {
    collapsed: false,
    type: 'related',
    read_only: true,
    list: false,
    endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestquestions/',
    key: 'acceptance_test_questions',
    many: true,
    templateOptions: {
      label: 'Acceptance test questions',
      type: 'related',
      edit: true,
      values: ['__str__'],
      delete: false,
      add: true
    }
  },
  {
    key: 'candidate_acceptance_tests'
  },
  {
    key: 'id',
    hide: true,
    type: 'input',
    read_only: false,
    templateOptions: {
      label: 'Id',
      type: 'text',
      required: false
    }
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    read_only: true,
    templateOptions: {
      label: 'Updated at',
      type: 'datetime',
      required: false
    }
  },
  {
    key: 'created_at',
    type: 'datepicker',
    read_only: true,
    templateOptions: {
      label: 'Created at',
      type: 'datetime',
      required: false
    }
  },
  {
    key: 'test_name',
    type: 'input',
    read_only: false,
    templateOptions: {
      label: 'Test Name',
      type: 'text',
      max: 255,
      required: true
    }
  },
  {
    key: 'description',
    type: 'input',
    read_only: false,
    templateOptions: {
      label: 'Description',
      type: 'text',
      required: false
    }
  },
  {
    key: 'valid_from',
    type: 'datepicker',
    read_only: false,
    templateOptions: {
      label: 'Valid From',
      type: 'date',
      required: true
    }
  },
  {
    key: 'valid_until',
    type: 'datepicker',
    read_only: false,
    templateOptions: {
      label: 'Valid Until',
      type: 'date',
      required: true
    }
  },
  {
    key: 'is_active',
    type: 'checkbox',
    read_only: false,
    default: false,
    templateOptions: {
      label: 'Active',
      type: 'checkbox',
      required: false
    }
  }
];

export const metadata = {
  list,
  form,
  formadd
};
