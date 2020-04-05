import { List, Form, CheckboxType } from '@webui/metadata';
import { Endpoints } from '@webui/data';

const formadd = function() {
  return [
    new Form.related.element('language_id', 'Language', Endpoints.Language)
      .updateModel({ withoutIdField: true })
      .updateTemplate({ param: 'alpha_2', display: '{name}' }),
    new Form.related.element(
      'company_id',
      'Company',
      Endpoints.Company
    ).updateModel({ withoutIdField: true }),
    new Form.checkbox.element('default', 'Default', CheckboxType.Checkbox)
  ];
};

const formset = function() {
  return {
    list: new List.main.element('companylanguage', 'Company Language')
      .disableSearch()
      .disableEdit()
      .setColumns([
        new List.column.element('language', 'Language').setContent([
          new List.input.element('language.name')
        ]),
        new List.column.element('default', 'Default').setContent([
          new List.icon.element('default').setValues({
            false: 'minus-circle',
            true: 'check-circle'
          })
        ]),
        new List.column.element('actions', 'Actions').setContent([
          {
            action: 'setDefaultLanguage',
            endpoint: '/companies/{company.id}/languages/{language.alpha_2}',
            icon: 'fa-check',
            title: 'Set Default',
            text_color: '#f0ad4e',
            type: 'button',
            field: 'language.alpha_2'
          }
        ])
      ]),
    fields: []
  };
};

export const companyLanguage = {
  formadd,
  formset
};
