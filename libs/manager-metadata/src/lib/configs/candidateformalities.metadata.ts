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
            field: 'tax_number'
          }
        ],
        label: 'Tax Number',
      },
      {
        name: 'personal_id',
        title: null,
        content: [
          {
            type: 'text',
            field: 'personal_id'
          }
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
