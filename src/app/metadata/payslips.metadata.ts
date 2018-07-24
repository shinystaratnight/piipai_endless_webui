const list = {
  list: {
    list: 'payslip',
    label: 'Payslip',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Payslip'
      }
    ],
    pagination_label: 'Payslip',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: { required: false, label: 'Payslip', type: 'static' },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/paysliplines/',
    read_only: true,
    templateOptions: {
      label: 'Payslip lines',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'payslip_lines',
    many: true
  },
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
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Updated at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Created at',
      type: 'datetime'
    },
    read_only: true
  },
  {
    key: 'payment_date',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Payment Date',
      type: 'date'
    },
    read_only: false
  },
  {
    key: 'annual_salary',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Annual salary',
      type: 'number'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skillbaserates/',
    read_only: true,
    templateOptions: {
      label: 'Hourly rate',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'hourly_rate',
    many: false
  },
  {
    key: 'from_date',
    type: 'datepicker',
    templateOptions: {
      required: true,
      label: 'From Date',
      type: 'date'
    },
    read_only: false
  },
  {
    key: 'to_date',
    type: 'datepicker',
    templateOptions: {
      required: true,
      label: 'To Date',
      type: 'date'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companies/',
    read_only: true,
    templateOptions: {
      label: 'Company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'company',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate',
    many: false
  },
  {
    key: 'cheque_number',
    type: 'textarea',
    templateOptions: {
      required: true,
      label: 'Cheque number',
      type: 'textarea'
    },
    read_only: false
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/paysliplines/',
    read_only: true,
    templateOptions: {
      label: 'Payslip lines',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'payslip_lines',
    many: true
  },
  {
    key: 'id',
    type: 'input',
    hide: true,
    templateOptions: { required: false, label: 'Id', type: 'text' },
    read_only: false
  },
  {
    key: 'updated_at',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Updated at', type: 'datetime' },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Created at', type: 'datetime' },
    read_only: true
  },
  {
    key: 'payment_date',
    type: 'datepicker',
    templateOptions: { required: false, label: 'Payment Date', type: 'date' },
    read_only: false
  },
  {
    key: 'annual_salary',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Annual salary',
      type: 'number'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skillbaserates/',
    read_only: true,
    templateOptions: {
      label: 'Hourly rate',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'hourly_rate',
    many: false
  },
  {
    key: 'from_date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'From Date', type: 'date' },
    read_only: false
  },
  {
    key: 'to_date',
    type: 'datepicker',
    templateOptions: { required: true, label: 'To Date', type: 'date' },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companies/',
    read_only: true,
    templateOptions: {
      label: 'Company',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'company',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate',
    many: false
  },
  {
    key: 'cheque_number',
    type: 'textarea',
    templateOptions: {
      required: true,
      label: 'Cheque number',
      type: 'textarea'
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};