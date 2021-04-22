import {
  SkillModel,
  Models,
  SkillWorkTypeModel,
  TimesheetModel
} from '@webui/data';
import { List, Form, InputType } from '@webui/metadata';

const form = () => [
  new TimesheetModel().formElement().hideField(),
  new SkillWorkTypeModel()
    .formElement()
    .updateValues(['translations'])
    .readOnly()
    .setQuery({
      company: 'currentCompany'
    }),
  new Form.input.element('rate', 'Rate', InputType.Number).hideField(),
  new Form.input.element('value', 'Value', InputType.Number)
];

const formadd = () => [
  new SkillModel().formElement().updateValues(['name']),
  new Form.input.element('timesheet', 'Timesheet', InputType.Text).hideField(),
  new SkillWorkTypeModel()
    .formElement()
    .updateValues(['default_rate', 'translations'])
    .required()
    .setPerfilledFields({
      [Models.Skill]: `{${Models.Skill}.id}`
    })
    .setQuery({
      skill: '{skill.id}',
      company: 'currentCompany'
    }),
  new Form.input.element('rate', 'Rate', InputType.Number).hideField(),
  new Form.input.element('value', 'Value', InputType.Number)
];

const formset = () => ({
  fields: [],
  list: new List.main.element('timesheetrates', 'Skill Activity')
    .disableSearch()
    .setColumns([
      new List.column.element('worktype', 'Skill Activity').setContent([
        new List.text.element('worktype')
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

export const timesheetratescandidate = {
  form,
  formadd,
  formset
};
