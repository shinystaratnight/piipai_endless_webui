import { Endpoints } from '@webui/data';
import { Form, InputType, List } from '@webui/metadata';


const list = () => new List.main.element('skillrateranges', ' Skill Rate Ranges');

const formset = () => {
  return {
    fields: [],
    list: new List.main.element('skillrateranges', 'Skill Rate Ranges')
      .disableSearch()
      .setTabs([
        {
          label: 'Skill Rate',
          is_collapsed: true,
          fields: ['lower_rate_limit', 'upper_rate_limit']
        },
        {
          label: 'Price List Rate',
          is_collapsed: true,
          fields: ['price_list_lower_rate_limit', 'price_list_upper_rate_limit']
        },
      ])
      .setColumns([
        new List.column.element('worktype', 'Worktype')
          .setContent([
            new List.related.element('worktype', Endpoints.SkillWorkTypes)
              .setShowIfRule(['worktype']),
            new List.select.element('worktype')
              .setValues({ null: 'Default' })
              .setColors({ null: 'info' })
              .setShowIfRule([{ worktype: null }])
          ]),

        new List.column.element('default_rate', 'Default Rate')
          .setContent([
            new List.text.element('default_rate')
              .setFormatValue('{currency}{field}'),
          ]),

        new List.column.element('price_list_default_rate', 'Price List Default Rate')
          .setContent([
            new List.text.element('price_list_default_rate')
              .setFormatValue('{currency}{field}'),
          ]),

        new List.column.element('actions', 'Actions')
          .setContent([
            new List.button.element('id', 'editForm', 'Edit')
              .setIcon('pencil-alt')
              .setTextColor('#f0ad4e'),
            new List.button.element('id', 'delete', 'Delete')
              .setIcon('trash')
              .setTextColor('#fa5c46')
          ]),

        new List.column.element('lower_rate_limit', 'Lower Rate Limit')
          .setContent([
            new List.text.element('lower_rate_limit')
              .setFormatValue('{currency}{field}'),
          ]),

        new List.column.element('upper_rate_limit', 'Upper Rate Limit')
          .setContent([
            new List.text.element('upper_rate_limit')
              .setFormatValue('{currency}{field}'),
          ]),

        new List.column.element('price_list_lower_rate_limit', 'Lower Rate Limit')
          .setContent([
            new List.text.element('price_list_lower_rate_limit')
              .setFormatValue('{currency}{field}'),
          ]),

        new List.column.element('price_list_upper_rate_limit', 'Upper Rate Limit')
          .setContent([
            new List.text.element('price_list_upper_rate_limit')
              .setFormatValue('{currency}{field}'),
          ]),
      ]),
  }
}

const formadd = () => [
  new Form.row.element()
    .setChildren([
      new Form.group.element()
        .setChildren([
          new Form.related.element('worktype', 'Work Type', Endpoints.SkillWorkTypes)
            .setQuery({
              skill_name: '{skill.name.id}'
            }),
        ]),
      new Form.group.element('Skill Rate')
        .setChildren([
          new Form.input.element('lower_rate_limit', 'Lower Rate Limit', InputType.Number)
            .setNumberOptions(0.01, 0),
          new Form.input.element('default_rate', 'Default Rate', InputType.Number)
            .setNumberOptions(0.01, 0),
          new Form.input.element('upper_rate_limit', 'Upper Rate Limit', InputType.Number)
            .setNumberOptions(0.01, 0),
        ]),
      new Form.group.element('Price List Rate')
        .setChildren([
          new Form.input.element('price_list_lower_rate_limit', 'Lower Rate Limit', InputType.Number)
            .setNumberOptions(0.01, 0),
          new Form.input.element('price_list_default_rate', 'Default Rate', InputType.Number)
            .setNumberOptions(0.01, 0),
          new Form.input.element('price_list_upper_rate_limit', 'Upper Rate Limit', InputType.Number)
            .setNumberOptions(0.01, 0),
        ]),
    ]),
  new Form.related.element('skill', 'Skill', Endpoints.Skill)
    .updateValues(['name'])
    .hideField(),
];

const form = () => [
  new Form.row.element()
    .setChildren([
      new Form.group.element()
        .setChildren([
          new Form.related.element('worktype', 'Work Type', Endpoints.SkillWorkTypes)
            .setQuery({
              skill_name: '{skill.name.id}'
            }),
        ]),
      new Form.group.element('Skill Rate')
        .setChildren([
          new Form.input.element('lower_rate_limit', 'Lower Rate Limit', InputType.Number)
            .setNumberOptions(0.01, 0)
            .setFormatOfValue('{currency}{field}'),
          new Form.input.element('default_rate', 'Default Rate', InputType.Number)
            .setNumberOptions(0.01, 0)
            .setFormatOfValue('{currency}{field}'),
          new Form.input.element('upper_rate_limit', 'Upper Rate Limit', InputType.Number)
            .setNumberOptions(0.01, 0)
            .setFormatOfValue('{currency}{field}'),
        ]),
      new Form.group.element('Price List Rate')
        .setChildren([
          new Form.input.element('price_list_lower_rate_limit', 'Lower Rate Limit', InputType.Number)
            .setNumberOptions(0.01, 0)
            .setFormatOfValue('{currency}{field}'),
          new Form.input.element('price_list_default_rate', 'Default Rate', InputType.Number)
            .setNumberOptions(0.01, 0)
            .setFormatOfValue('{currency}{field}'),
          new Form.input.element('price_list_upper_rate_limit', 'Upper Rate Limit', InputType.Number)
            .setNumberOptions(0.01, 0)
            .setFormatOfValue('{currency}{field}'),
        ]),
    ]),
  new Form.related.element('skill', 'Skill', Endpoints.Skill)
    .hideField()
    .updateValues(['name']),
]

export const skillrateranges = {
  list,
  formset,
  formadd,
  form,
}
