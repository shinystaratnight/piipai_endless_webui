import { Form, DatepickerType, InputType, CheckboxType } from '@webui/metadata';
import { Endpoints } from '@webui/data';

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
            label: 'Skills',
            param: 'industry.name'
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
            label: 'Skills',
            param: 'skill.name'
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
            label: 'Skills',
            param: 'tag.name'
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
            label: 'Workflow Node',
            param: 'company_workflow_node.name'
          }
        ],
        name: 'acceptance_tests_workflow_nodes',
        title: null,
        label: 'Workflow nodes',
        delim: null
      },
    ],
    editDisable: false
  }
};

const form = function() {
  return [
    new Form.row.element()
      .setChildren([
        new Form.group.element('General')
          .setChildren([
            new Form.input.element('test_name', 'Test Name', InputType.Text)
              .required()
              .updateTemplate({ max: 255 }),

              new Form.textarea.element('description', 'Description'),

            new Form.checkbox.element('is_active', 'Active', CheckboxType.Checkbox),

            new Form.datepicker.element('valid_from', 'Valid From', DatepickerType.Date)
              .required(),

            new Form.datepicker.element('valid_until', 'Valid Until', DatepickerType.Date),
          ]),

        new Form.group.element('Relationships')
          .setChildren([
            new Form.related.element('acceptance_tests_industries', 'Industries', Endpoints.Industry)
              .update({ many: true, useOptions: true })
              .setActions(false, false, true)
              .setRelatedObjects('industry', { ecceptance_test: '{id}' }, Endpoints.AcceptenceTestIndustry),

            new Form.related.element('acceptance_tests_skills', 'Skills', Endpoints.Skill)
              .update({ many: true, useOptions: true })
              .setActions(false, false, true)
              .setRelatedObjects('skill', { ecceptance_test: '{id}' }, Endpoints.AcceptenceTestSkill),

            new Form.related.element('acceptance_tests_tags', 'Tags', Endpoints.Tag)
              .update({ many: true, useOptions: true })
              .setActions(false, false, true)
              .setRelatedObjects('tag', { ecceptance_test: '{id}' }, Endpoints.AcceptenceTestTag),

            new Form.related.element('acceptance_tests_workflow_nodes', 'Workflow Node', Endpoints.AcceptenceTestWorkflowNode)
              .doNotSend()
              .update({ many: true, doNotChoice: true, visibleMode: true, options: [] })
              .setActions(true, false, true)
              .setPerfilledFields({ acceptance_test: '{id}' })
              .updateValues(['company_workflow_node']),
          ])
      ])
  ]
}

const formadd = function() {
  return [
    new Form.input.element('test_name', 'Test Name', InputType.Text)
      .required()
      .updateTemplate({ max: 255 }),

    new Form.textarea.element('description', 'Description'),

    new Form.checkbox.element('is_active', 'Active', CheckboxType.Checkbox)
      .update({ default: true }),

    new Form.datepicker.element('valid_from', 'Valid From', DatepickerType.Date)
      .required()
      .updateTemplate({ hidePreviewError: true }),

    new Form.datepicker.element('valid_until', 'Valid Until', DatepickerType.Date),
  ];
}

export const acceptancetests = {
  list,
  form,
  formadd
};
