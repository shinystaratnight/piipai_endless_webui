const formset = {
  fields: [],
  list: {
    columns: [
      {
        name: 'country',
        title: null,
        content: [
          {
            type: 'text',
            field: 'country.name'
          }
        ],
        label: 'Country',
      },
      {
        name: 'tax_number',
        title: null,
        content: [
          {
            type: 'text',
            field: 'tax_number',
            showIf: ['tax_number']
          },
          {
            values: {
              false: 'N/A',
            },
            color: {
              false: 'danger'
            },
            field: 'formality_attributes.display_tax_number',
            type: 'select'
          },
        ],
        label: 'Tax Number',
      },
      {
        name: 'personal_id',
        title: null,
        content: [
          {
            type: 'text',
            field: 'personal_id',
            showIf: [ 'personal_id' ],
          },
          {
            values: {
              false: 'N/A',
            },
            color: {
              false: 'danger'
            },
            field: 'formality_attributes.display_personal_id',
            type: 'select'
          },
        ],
        label: 'Personal ID',
      },
    ],
    list: 'candidateformalities',
    label: 'Candidate Formalities',
    pagination_label: 'Candidate Formalities',
  }
};

export const candidateformalities = {
  formset,
};
