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
    filters: [
      {
        key: 'active_states',
        label: 'Relationships',
        options: [
          {
            value: 'skill',
            label: 'Skills'
          },
          {
            value: 'tag',
            label: 'Tags'
          },
          {
            value: 'industry',
            label: 'Industries'
          },
        ],
        query: 'type',
        type: 'select'
      },
    ],
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
      },
      {
        content: [
          {
            field: 'acceptance_tests_industries',
            type: 'text',
            label: 'Skills'
          }
        ],
        name: 'acceptance_tests_industries',
        title: null,
        label: 'Industries',
        delim: null
      },
      {
        content: [
          {
            field: 'acceptance_tests_skills',
            type: 'text',
            label: 'Skills'
          }
        ],
        name: 'acceptance_tests_skills',
        title: null,
        label: 'Skills',
        delim: null
      },
      {
        content: [
          {
            field: 'acceptance_tests_tags',
            type: 'text',
            label: 'Skills'
          }
        ],
        name: 'acceptance_tests_tags',
        title: null,
        label: 'Tags',
        delim: null
      },
      {
        content: [
          {
            field: 'acceptance_tests_workflow_nodes',
            type: 'text',
            label: 'Workflow Node'
          }
        ],
        name: 'acceptance_tests_workflow_nodes',
        title: null,
        label: 'Tags',
        delim: null
      },
    ],
    editDisable: false
  }
};

const form = [
  {
    type: 'row',
    children: [
      {
        type: 'group',
        label: 'General',
        name: true,
        children: [
          {
            key: 'test_name',
            type: 'input',
            templateOptions: {
              label: 'Test Name',
              type: 'text',
              max: 255,
              required: true
            }
          },
          {
            key: 'description',
            type: 'textarea',
            read_only: false,
            templateOptions: {
              label: 'Description',
              type: 'text',
              required: false
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
        ]
      },
      {
        type: 'group',
        label: 'Relationships',
        name: true,
        children: [
          {
            type: 'related',
            send: false,
            endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestindustries/',
            key: 'acceptance_tests_industries',
            many: true,
            options: [],
            doNotChoice: true,
            prefilled: {
              acceptance_test: '{id}'
            },
            templateOptions: {
              label: 'Industries',
              type: 'related',
              values: ['__str__'],
              display: '{industry.__str__}',
              delete: true,
              add: true
            }
          },
          {
            type: 'related',
            send: false,
            endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestskills/',
            key: 'acceptance_tests_skills',
            many: true,
            options: [],
            doNotChoice: true,
            prefilled: {
              acceptance_test: '{id}'
            },
            templateOptions: {
              label: 'Skills',
              type: 'related',
              values: ['__str__'],
              display: '{skill.__str__}',
              delete: true,
              add: true
            }
          },
          {
            type: 'related',
            send: false,
            endpoint: '/ecore/api/v2/acceptance-tests/acceptancetesttags/',
            key: 'acceptance_tests_tags',
            many: true,
            options: [],
            doNotChoice: true,
            prefilled: {
              acceptance_test: '{id}'
            },
            templateOptions: {
              label: 'Tags',
              type: 'related',
              values: ['__str__'],
              display: '{tag.__str__}',
              delete: true,
              add: true
            }
          },
          {
            type: 'related',
            send: false,
            endpoint: '/ecore/api/v2/acceptance-tests/acceptancetestworkflownodes/',
            key: 'acceptance_tests_workflow_nodes',
            many: true,
            options: [],
            doNotChoice: true,
            prefilled: {
              acceptance_test: '{id}'
            },
            templateOptions: {
              label: 'Workflow Node',
              type: 'related',
              values: ['__str__'],
              display: '{company_workflow_node.__str__}',
              delete: true,
              add: true
            }
          },
        ]
      }
    ]
  },
];

const formadd = [
  {
    key: 'test_name',
    type: 'input',
    templateOptions: {
      label: 'Test Name',
      type: 'text',
      max: 255,
      required: true
    }
  },
  {
    key: 'description',
    type: 'textarea',
    templateOptions: {
      label: 'Description',
      type: 'text',
      required: false
    }
  },
  {
    key: 'is_active',
    type: 'checkbox',
    default: true,
    templateOptions: {
      label: 'Active',
      type: 'checkbox',
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
    }
  },
  {
    key: 'valid_until',
    type: 'datepicker',
    read_only: false,
    templateOptions: {
      label: 'Valid Until',
      type: 'date',
    }
  },
];

export const metadata = {
  list,
  form,
  formadd
};