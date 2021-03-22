import { Endpoints } from '@webui/data';
import { Form, InputType } from '@webui/metadata';

const formadd = () => [
  new Form.related.element('skill', 'Skill', Endpoints.Skill),
  new Form.input.element('skill_name', 'Skill Name', InputType.Text),
  new Form.input.element('name', 'Name', InputType.Text),
  new Form.related.element('uom', 'Unit of measurements', Endpoints.UnitOfMeasurements)
];

const form = () => [
  new Form.related.element('skill', 'Skill', Endpoints.Skill),
  new Form.input.element('skill_name', 'Skill Name', InputType.Text),
  new Form.input.element('name', 'Name', InputType.Text),
  new Form.related.element('uom', 'Unit of measurements', Endpoints.UnitOfMeasurements)
]

export const worktypes = {
  formadd,
  form
}
