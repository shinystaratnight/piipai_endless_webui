import {
  Form,
  Filter,
  List,
  DatepickerType,
  InputType,
  CheckboxType,
  generateOptions
} from '@webui/metadata';
import { Endpoints } from '@webui/data';

const list = function () {
  return {
    list: new List.main.element('acceptancetest', 'Acceptance Test')
      .disableSearch()
      .setFilters([
        new Filter.select.element({
          key: 'active_states',
          label: 'Relationships',
          values: generateOptions({
            skill: 'Skills',
            tag: 'Tags',
            industry: 'Industries'
          })
        })
      ])
      .setColumns([
        new List.column.element('__str__', 'Acceptance Test').setContent([
          new List.static.element('__str__')
        ]),

        new List.column.element(
          'acceptance_tests_industries',
          'Industries'
        ).setContent([
          new List.text.element('acceptance_tests_industries').update({
            param: 'industry.name'
          })
        ]),

        new List.column.element(
          'acceptance_tests_skills',
          'Skills'
        ).setContent([
          new List.text.element('acceptance_tests_skills').update({
            param: 'skill.name'
          })
        ]),

        new List.column.element('acceptance_tests_tags', 'Tags').setContent([
          new List.text.element('acceptance_tests_tags').update({
            param: 'tag.name'
          })
        ]),

        new List.column.element(
          'acceptance_tests_workflow_nodes',
          'Workflow nodes'
        ).setContent([
          new List.text.element('acceptance_tests_workflow_nodes').update({
            param: 'company_workflow_node.name'
          })
        ])
      ])
  };
};

const form = function () {
  return [
    new Form.row.element().setChildren([
      new Form.group.element('General').setChildren([
        new Form.input.element('test_name', 'Test Name', InputType.Text)
          .required()
          .updateTemplate({ max: 255 }),

        new Form.textarea.element('description', 'Description'),

        new Form.checkbox.element('is_active', 'Active', CheckboxType.Checkbox),

        new Form.datepicker.element(
          'valid_from',
          'Valid From',
          DatepickerType.Date
        ).required(),

        new Form.datepicker.element(
          'valid_until',
          'Valid Until',
          DatepickerType.Date
        )
      ]),

      new Form.group.element('Relationships').setChildren([
        new Form.related.element(
          'acceptance_tests_industries',
          'Industries',
          Endpoints.Industry
        )
          .updateModel({ many: true, useOptions: true })
          .setActions({ delete: true })
          .setRelatedObjects(
            'industry',
            { acceptance_test: '{id}' },
            Endpoints.AcceptenceTestIndustry
          ),

        new Form.related.element(
          'acceptance_tests_skills',
          'Skills',
          Endpoints.Skill
        )
          .updateModel({ many: true, useOptions: true })
          .setActions({ delete: true })
          .setRelatedObjects(
            'skill',
            { acceptance_test: '{id}' },
            Endpoints.AcceptenceTestSkill
          ),

        new Form.related.element('acceptance_tests_tags', 'Tags', Endpoints.Tag)
          .updateModel({ many: true, useOptions: true })
          .setActions({ delete: true })
          .setRelatedObjects(
            'tag',
            { acceptance_test: '{id}' },
            Endpoints.AcceptenceTestTag
          ),

        new Form.related.element(
          'acceptance_tests_workflow_nodes',
          'Workflow Node',
          Endpoints.AcceptenceTestWorkflowNode
        )
          .doNotSend()
          .updateModel({
            many: true,
            doNotChoice: true,
            visibleMode: true,
            options: []
          })
          .setActions({ add: true, delete: true })
          .setPerfilledFields({ acceptance_test: '{id}' })
          .updateValues(['company_workflow_node'])
      ])
    ])
  ];
};

const formadd = function () {
  return [
    new Form.input.element('test_name', 'Test Name', InputType.Text)
      .required()
      .updateTemplate({ max: 255 }),

    new Form.textarea.element('description', 'Description'),

    new Form.checkbox.element(
      'is_active',
      'Active',
      CheckboxType.Checkbox
    ).setDefaultValue(true),

    new Form.datepicker.element('valid_from', 'Valid From', DatepickerType.Date)
      .required()
      .updateTemplate({ hidePreviewError: true }),

    new Form.datepicker.element(
      'valid_until',
      'Valid Until',
      DatepickerType.Date
    )
  ];
};

export const acceptancetests = {
  list,
  form,
  formadd
};
