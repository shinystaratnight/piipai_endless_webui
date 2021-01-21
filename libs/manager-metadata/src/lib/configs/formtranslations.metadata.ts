import { Endpoints } from "@webui/data";

const formset = {
  list: [],
  fields: [
    {
      key: 'language',
      type: 'related',
      width: 200,
      send: false,
      endpoint: `${Endpoints.CompanyLanguages}{company.id}/languages/`,
      replaceByData: true,
      templateOptions: {
        required: true,
        label: 'Language',
        display: '{language.name}',
        listParam: '{language.alpha_2}',
      },
    },
    // {
    //   key: 'is_active',
    //   default: false,
    //   hide: true,
    //   type: 'checkbox',
    //   templateOptions: {
    //     required: false,
    //     label: 'Is active',
    //     type: 'checkbox'
    //   },
    //   read_only: false
    // },
    {
      key: 'title',
      // default: '{language.relatedData.title}',
      type: 'input',
      useValue: true,
      // updated: ['language'],
      // showIf: ['language.id'],
      templateOptions: {
        required: false,
        label: 'Title',
        max: 1024,
        type: 'text'
      },
      read_only: false
    },
    {
      key: 'short_description',
      // default: '{language.relatedData.short_description}',
      // updated: ['language'],
      // showIf: ['language.id'],
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Short description',
        type: 'text'
      },
      read_only: false
    },
    {
      key: 'button_text',
      // default: '{language.relatedData.save_button_text}',
      // updated: ['language'],
      // showIf: ['language.id'],
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Button text',
        max: 512,
        type: 'text'
      },
      read_only: false
    },
    {
      key: 'result_messages',
      // default: '{language.relatedData.submit_message}',
      // updated: ['language'],
      // showIf: ['language.id'],
      type: 'textarea',
      templateOptions: {
        required: false,
        label: 'Result message',
        type: 'textarea',
        // description: 'Would be used for display user message after saving'
      },
      read_only: false
    }
  ]
}

export const formtranslations = {
  formset,
}