import { Endpoints, SkillModel, Models } from "@webui/data";
import { List, Form, InputType } from "@webui/metadata";

const form = () => [
  new Form.related.element('timesheet', 'Timesheet', Endpoints.Timesheet).hideField(),
  new Form.related.element('worktype', 'Skill Activity', Endpoints.SkillWorkTypes)
    .readOnly()
    .setQuery({
      'company': 'currentCompany'
    }),
  new Form.input.element('rate', 'Rate', InputType.Number)
    .readOnly(),
  new Form.input.element('value', 'Value', InputType.Number),
];

const formadd = () => [
  new SkillModel().formElement()
    .updateValues(['name']),
  new Form.input.element('timesheet', 'Timesheet', InputType.Text).hideField(),
  new Form.related.element('worktype', 'Skill Activity', Endpoints.SkillWorkTypes)
    .updateValues(['default_rate'])
    .required()
    .setPerfilledFields({
      [Models.Skill]: `{${Models.Skill}.id}`
    })
    .setQuery({
      'skill_name': '{skill.name.id}',
      'company': 'currentCompany'
    }),
  new Form.input.element('rate', 'Rate', InputType.Number)
    .readOnly()
    .setDefaultValue('{worktype.default_rate}'),
  new Form.input.element('value', 'Value', InputType.Number),
];

const formset = () => ({
  fields: [],
  list: new List.main.element('timesheetrates', 'Skill Activity')
    .disableSearch()
    .setColumns([
      new List.column.element('worktype', 'Skill Activity')
        .setContent([
          new List.related.element('worktype', Endpoints.SkillWorkTypes)
        ]),
      new List.column.element('rate', 'Rate')
        .setContent([
          new List.input.element('rate')
        ]),
      new List.column.element('value', 'Value')
        .setContent([
          new List.input.element('value')
        ]),
      new List.column.element('actions', 'Actions')
        .setContent([
          new List.button.element('id', 'editForm', 'Edit')
            .setIcon('pencil-alt')
            .setTextColor('#f0ad4e'),
          new List.button.element('id', 'delete', 'Delete')
            .setIcon('trash')
            .setTextColor('#fa5c46'),
        ])
    ]),
})

export const timesheetratescandidate = {
  form,
  formadd,
  formset,
}
