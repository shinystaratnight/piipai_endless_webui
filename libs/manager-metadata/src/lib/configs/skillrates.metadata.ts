import { Endpoints } from '@webui/data';
import { List, Form, InputType } from '@webui/metadata';

const formset = {
  fields: [],
  list: new List.main.element('skillrates', 'Skill Rates')
    .disableSearch()
    .setColumns([
      new List.column.element('rate', 'Rate')
        .setContent([
          new List.text.element('rate')
            .setFormatValue('{currency}{field}'),
        ]),
      new List.column.element('uom', 'Unit of measurements')
        .setContent([
          new List.static.element('uom.name')
        ]),
      new List.column.element('worktype', 'work type')
        .setContent([
          new List.text.element('worktype.name')
        ]),
      new List.column.element('actions', 'Actions')
        .setContent([
          new List.button.element('id', 'editForm', 'Edit')
            .setIcon('pencil-alt')
            .setTextColor('#f0ad4e')
        ])
    ])
}

const formadd = () => [
  new Form.related.element('worktype', 'Work Type', Endpoints.SkillWorkTypes),
  new Form.input.element('rate', 'Rate', InputType.Number)
    .setNumberOptions(0.01, 0),
  new Form.related.element('uom', 'Unit of measurements', Endpoints.UnitOfMeasurements),
  new Form.related.element('skill_rel', 'Skill', Endpoints.CandidateSkill)
    .hideField(),
];

const form = () => [
  new Form.related.element('worktype', 'Work Type', Endpoints.SkillWorkTypes),
  new Form.input.element('rate', 'Rate', InputType.Number)
    .setNumberOptions(0.01, 0),
  new Form.related.element('uom', 'Unit of measurements', Endpoints.UnitOfMeasurements),
  new Form.related.element('skill_rel', 'Skill', Endpoints.Skill)
    .hideField(),
];

export const skillrates = {
  formset,
  formadd,
  form,
}
