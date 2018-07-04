const list = {
  list: {
    list: 'superannuationfund',
    label: 'Superannuation Fund',
    columns: [
      {
        content: [
          {
            field: '__str__',
            type: 'static'
          }
        ],
        name: '__str__',
        label: 'Superannuation Fund'
      }
    ],
    pagination_label: 'Superannuation Fund',
    search_enabled: true,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Superannuation Fund',
        type: 'static'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Name',
      max: 76,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'membership_number',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Employer Membership Number',
      max: 255,
      type: 'text'
    },
    read_only: false
  }
];

const formadd = [
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Name',
      max: 76,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'membership_number',
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Employer Membership Number',
      max: 255,
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
