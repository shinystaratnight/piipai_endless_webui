export const testMetadata = {
  form: [
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
              endpoint: '/pricing/industries/',
              key: 'acceptance_tests_industries',
              many: true,
              useOptions: true,
              relatedObjects: {
                endpoint: '/acceptance-tests/acceptancetestindustries/',
                data: {
                  acceptance_test: '{id}'
                },
                field: 'industry'
              },
              templateOptions: {
                label: 'Industries',
                type: 'related',
                values: ['__str__'],
                delete: true,
                add: false
              }
            },
            {
              type: 'related',
              endpoint: '/skills/skills/',
              key: 'acceptance_tests_skills',
              many: true,
              useOptions: true,
              relatedObjects: {
                endpoint: '/acceptance-tests/acceptancetestskills/',
                data: {
                  acceptance_test: '{id}'
                },
                field: 'skill'
              },
              templateOptions: {
                label: 'Skills',
                type: 'related',
                values: ['__str__'],
                delete: true,
                add: false,
              }
            },
            {
              type: 'related',
              endpoint: '/core/tags/',
              key: 'acceptance_tests_tags',
              many: true,
              useOptions: true,
              relatedObjects: {
                endpoint: '/acceptance-tests/acceptancetesttags/',
                data: {
                  acceptance_test: '{id}'
                },
                field: 'tag'
              },
              templateOptions: {
                label: 'Tags',
                type: 'related',
                values: ['__str__'],
                delete: true,
                add: false
              }
            },
            {
              type: 'related',
              send: false,
              endpoint: '/acceptance-tests/acceptancetestworkflownodes/',
              key: 'acceptance_tests_workflow_nodes',
              many: true,
              options: [],
              doNotChoice: true,
              visibleMode: true,
              prefilled: {
                acceptance_test: '{id}'
              },
              templateOptions: {
                label: 'Workflow Node',
                type: 'related',
                values: ['__str__', 'company_workflow_node'],
                display: '{__str__}',
                delete: true,
                add: true
              }
            },
          ]
        }
      ]
    },
  ],

  formadd: [
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
        required: true,
        hidePreviewError: true,
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
  ]
};

export const questionMetadata = {
  form: [
    {
      type: 'row',
      children: [
        {
          endpoint: '/acceptance-tests/acceptancetestanswers/',
          read_only: true,
          templateOptions: {
            label: 'Acceptance test answers',
            add: true,
            delete: false,
            values: ['__str__'],
            type: 'related',
            edit: true
          },
          hide: true,
          type: 'related',
          key: 'acceptance_test_answers',
          many: true
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
        },
        {
          key: 'question',
          type: 'textarea',
          templateOptions: {
            required: true,
            label: 'Question',
            max: 255,
          },
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
              { value: 1, label: 'Text' },
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
        {
          type: 'button',
          width: .2,
          color: 'primary',
          templateOptions: {
            type: 'submit',
            p: true,
            small: true,
          }
        }
      ]
    }
  ],

  formadd: [
    {
      type: 'row',
      children: [
        {
          key: 'question',
          type: 'textarea',
          templateOptions: {
            label: 'Question',
            max: 255,
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
              { value: 1, label: 'Text' },
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
        {
          type: 'button',
          width: .2,
          color: 'primary',
          templateOptions: {
            text: 'Save',
            type: 'submit',
            p: true,
            small: true,
          }
        },
      ]
    }
  ]
};

export const answerMetadata = {
  form: [
    {
      type: 'row',
      children: [
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
          key: 'answer',
          type: 'textarea',
          templateOptions: {
            required: true,
            label: 'Answer',
            max: 255
          },
        },
        {
          key: 'order',
          type: 'input',
          hide: true,
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
          key: 'score',
          type: 'input',
          templateOptions: {
            required: true,
            label: 'Score',
            max: 5,
            type: 'number',
            min: 1,
            description: 'Values can be between 1 and 5'
          },
        },
        {
          type: 'button',
          width: 0.4,
          color: 'primary',
          templateOptions: {
            type: 'submit',
            p: true,
            small: true
          }
        }
      ]
    }
  ],

  formadd: [
    {
      type: 'row',
      children: [
        {
          key: 'answer',
          type: 'textarea',
          templateOptions: {
            required: true,
            label: 'Answer',
            max: 255
          },
          read_only: false
        },
        {
          key: 'order',
          type: 'input',
          hide: true,
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
          key: 'score',
          type: 'input',
          templateOptions: {
            required: true,
            label: 'Score',
            max: 5,
            type: 'number',
            min: 1,
            description: 'Values can be between 1 and 5'
          },
          read_only: false
        },
        {
          type: 'button',
          width: 0.4,
          color: 'primary',
          templateOptions: {
            text: 'Save',
            type: 'submit',
            p: true,
            small: true
          }
        }
      ]
    }
  ]
}
