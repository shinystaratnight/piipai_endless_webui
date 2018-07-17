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
    type: 'row',
    children: [
      {
        type: 'group',
        label: '',
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
        label: '',
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
            templateOptions: {
              label: 'Acceptance tests industries',
              type: 'related',
              values: ['__str__'],
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
            templateOptions: {
              label: 'Acceptance tests skills',
              type: 'related',
              values: ['__str__'],
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
            templateOptions: {
              label: 'Acceptance tests tags',
              type: 'related',
              values: ['__str__'],
              delete: true,
              add: true
            }
          },
          // {
          //   key: 'created_at',
          //   type: 'datepicker',
          //   read_only: true,
          //   templateOptions: {
          //     label: 'Created at',
          //     type: 'datetime',
          //     required: false
          //   }
          // },
          // {
          //   key: 'updated_at',
          //   type: 'datepicker',
          //   read_only: true,
          //   templateOptions: {
          //     label: 'Updated at',
          //     type: 'datetime',
          //     required: false
          //   }
          // },
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
