const list = {
  list: {
    list: 'bankaccount',
    label: 'Bank Account',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Bank Account'
      }
    ],
    pagination_label: 'Bank Account',
    search_enabled: true,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Bank Account',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    endpoint: '/ecore/api/v2/core/contacts/',
    read_only: true,
    templateOptions: {
      label: 'Contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    key: 'contact'
  },
  {
    key: 'bank_name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Bank Name',
      max: 63,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'bank_account_name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Bank Account Name',
      max: 63,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'bsb',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'BSB',
      max: 6,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'account_number',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Account Number',
      max: 10,
      type: 'text'
    },
    read_only: false
  }
];

const formadd = [
  {
    endpoint: '/ecore/api/v2/core/contacts/',
    read_only: false,
    templateOptions: {
      label: 'Contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    type: 'related',
    key: 'contact'
  },
  {
    key: 'bank_name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Bank Name',
      max: 63,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'bank_account_name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Bank Account Name',
      max: 63,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'bsb',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'BSB',
      max: 6,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'account_number',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Account Number',
      max: 10,
      type: 'text'
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
