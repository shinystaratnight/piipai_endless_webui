import {
  SkillModel,
  Models,
  TimesheetModel,
  SkillWorkTypeModel
} from '@webui/data';
import { List, Form, InputType } from '@webui/metadata';

const form = () => [
  new TimesheetModel().formElement().hideField(),
  new SkillWorkTypeModel()
    .formElement()
    .readOnly()
    .updateValues(['translations'])
    .setQuery({
      company: '{company}'
    }),
  new Form.input.element('rate', 'Rate', InputType.Number),
  new Form.input.element('value', 'Value', InputType.Number)
];

const formadd = () => [
  new Form.input.element('timesheet', 'Timesheet', InputType.Text).hideField(),
  new Form.input.element('company', 'Company', InputType.Text).hideField(),
  new SkillWorkTypeModel()
    .formElement()
    .required()
    .setActions({
      add: true
    })
    .setPerfilledFields({
      [Models.Skill]: `{${Models.Skill}.id}`
    })
    .updateValues(['translations', 'uom', 'skill_rate_ranges'])
    .setQuery({
      skill: '{skill.id}',
      company: '{company}'
    }),
  new SkillModel().formElement().updateValues(['name']),
  new Form.input.element('rate', 'Rate', InputType.Number)
    .setDefaultValue('{worktype.skill_rate_ranges.default_rate}')
    .setNumberOptions(0.01),
  new Form.input.element('value', 'Value', InputType.Number)
    .setIcon('{worktype.uom.short_name}')
    .setNumberOptions(0.01)
];

const formset = () => ({
  fields: [],
  list: new List.main.element('timesheetrates', 'Skill Activity')
    .disableSearch()
    .setColumns([
      new List.column.element('worktype', 'Skill Activity').setContent([
        new List.text.element('worktype')
      ]),
      new List.column.element('rate', 'Rate').setContent([
        new List.input.element('rate')
      ]),
      new List.column.element('value', 'Value').setContent([
        new List.input.element('value')
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
});

export const timesheetrates = {
  form,
  formadd,
  formset
};
