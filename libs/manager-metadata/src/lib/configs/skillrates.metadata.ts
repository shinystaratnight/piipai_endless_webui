import { Endpoints } from '@webui/data';
import { List, Form, InputType } from '@webui/metadata';

const formset = {
  fields: [],
  list: new List.main.element('skillrates', 'Skill Rates')
    .disableSearch()
    .setColumns([
      new List.column.element('rate', 'Rate').setContent([
        new List.text.element('rate').setFormatValue('{currency}{field}')
      ]),
      new List.column.element('worktype', 'work type').setContent([
        new List.text.element('worktype.name')
      ]),
      new List.column.element('actions', 'Actions').setContent([
        new List.button.element('id', 'editForm', 'Edit')
          .setIcon('pencil-alt')
          .setTextColor('#f0ad4e'),
        new List.button.element('id', 'delete', 'Delete')
          .setIcon('trash')
          .setTextColor('#fa5c46')
      ])
    ])
};

const formadd = () => [
  new Form.related.element('skill', 'Skill Name', Endpoints.Skill)
    .updateValues(['name'])
    .readOnly()
    .doNotSend(),
  new Form.related.element(
    'worktype',
    'Work Type',
    Endpoints.SkillWorkTypes
  ).setQuery({
    skill: '{skill.id}',
    limited: true
  }),
  new Form.input.element('rate', 'Rate', InputType.Number).setNumberOptions(
    0.01,
    0
  ),
  new Form.related.element('skill_rel', 'Skill', Endpoints.CandidateSkill)
    .updateValues(['skill'])
    .hideField()
];

const form = () => [
  new Form.related.element(
    'worktype',
    'Work Type',
    Endpoints.SkillWorkTypes
  ).readOnly(),
  new Form.input.element('rate', 'Rate', InputType.Number).setNumberOptions(
    0.01,
    0
  ),
  new Form.related.element('skill_rel', 'Skill', Endpoints.Skill)
    .updateValues(['skill'])
    .hideField()
];

export const skillrates = {
  formset,
  formadd,
  form
};
