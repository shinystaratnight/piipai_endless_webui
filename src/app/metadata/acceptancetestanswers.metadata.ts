const list = {
  list: {
    list: 'acceptancetestanswer',
    label: 'Acceptance Test Answer',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Acceptance Test Answer'
      }
    ],
    pagination_label: 'Acceptance Test Answer',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Acceptance Test Answer',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    type: 'row',
    children: [
      {
        key: 'id',
        type: 'input',
        hide: true,
        templateOptions: {
          required: false,
          label: 'Id',
          type: 'text'
        },
        read_only: false
      },
      {
        key: 'answer',
        type: 'textarea',
        templateOptions: {
          required: true,
          label: 'Answer',
          max: 255
        },
      },
      {
        key: 'order',
        type: 'input',
        hide: true,
        templateOptions: {
          required: true,
          label: 'Order',
          max: 32767,
          type: 'number',
          min: -32768
        },
        read_only: false
      },
      {
        key: 'score',
        type: 'input',
        templateOptions: {
          required: false,
          label: 'Score',
          max: 5,
          type: 'number',
          min: 1
        },
      },
      {
        type: 'button',
        width: 0.4,
        color: 'warning',
        templateOptions: {
          type: 'submit',
          p: true,
          small: true
        }
      }
    ]
  }
];

const formadd = [
  {
    type: 'row',
    children: [
      {
        key: 'answer',
        type: 'textarea',
        templateOptions: {
          required: true,
          label: 'Answer',
          max: 255
        },
        read_only: false
      },
      {
        key: 'order',
        type: 'input',
        hide: true,
        templateOptions: {
          required: true,
          label: 'Order',
          max: 32767,
          type: 'number',
          min: -32768
        },
        read_only: false
      },
      {
        key: 'score',
        type: 'input',
        templateOptions: {
          required: false,
          label: 'Score',
          max: 5,
          type: 'number',
          min: 1
        },
        read_only: false
      },
      {
        type: 'button',
        width: 0.4,
        color: 'primary',
        templateOptions: {
          text: 'Save',
          type: 'submit',
          p: true,
          small: true
        }
      }
    ]
  }
];

export const metadata = {
  list,
  form,
  formadd
};
