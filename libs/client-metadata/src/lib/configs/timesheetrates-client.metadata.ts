import { Endpoints, SkillModel, Models, TimesheetModel, SkillWorkTypeModel } from "@webui/data";
import { List, Form, InputType } from "@webui/metadata";

const getRateField = () => new Form.input.element('rate', 'Rate', InputType.Number).hideField();
const getValueField = () => new Form.input.element('value', 'Value', InputType.Number);
const getTimesheetField = () => new TimesheetModel().formElement().hideField();


const form = () => [
  getTimesheetField(),
  new SkillWorkTypeModel().formElement()
    .updateValues(['translations'])
    .readOnly()
    .setQuery({
      'company': 'currentCompany'
    }),
  getRateField(),
  getValueField(),
];

const formadd = () => [
  new SkillModel().formElement()
    .updateValues(['name']),
  getTimesheetField(),
  new SkillWorkTypeModel().formElement()
    .setActions({ add: true })
    .updateValues(['translations'])
    .required()
    .setPerfilledFields({
      [Models.Skill]: `{${Models.Skill}.id}`
    })
    .setQuery({
      'skill': '{skill.id}',
      'company': 'currentCompany'
    }),
  getRateField(),
  getValueField(),
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

export const timesheetratesclient = {
  form,
  formadd,
  formset,
}
