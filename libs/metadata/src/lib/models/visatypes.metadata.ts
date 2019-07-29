const list = {
  list: {
    list: 'visatype',
    label: 'Visa Type',
    columns: [
      {
        content: [{ field: '__str__', type: 'static' }],
        name: '__str__',
        label: 'Visa Type'
      }
    ],
    pagination_label: 'Visa Type',
    search_enabled: false,
    editDisable: false
  },
  fields: [
    {
      key: '__str__',
      type: 'static',
      templateOptions: { required: false, label: 'Visa Type', type: 'static' },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contacts',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    hide: true,
    visibleMode: true,
    type: 'related',
    key: 'candidate_contacts',
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
    hide: true,
    templateOptions: { required: false, label: 'Updated at', type: 'datetime' },
    read_only: true
  },
  {
    key: 'created_at',
    type: 'datepicker',
    hide: true,
    templateOptions: { required: false, label: 'Created at', type: 'datetime' },
    read_only: true
  },
  {
    key: 'subclass',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Subclass Number',
      max: 4,
      type: 'text'
    },
    read_only: true
  },
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Visa Type Name',
      max: 255,
      type: 'text'
    },
    read_only: true
  },
  {
    key: 'general_type',
    default: 'other',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'General Visa Type',
      type: 'select',
      options: [
        { value: 'visitor', label: 'Visitor' },
        { value: 'working', label: 'Working and Skilled' },
        { value: 'studying', label: 'Studying' },
        { value: 'family', label: 'Family and Spousal' },
        { value: 'refugee', label: 'Refugee and Humanitarian' },
        { value: 'other', label: 'Other' },
        { value: 'repealed', label: 'Repealed' },
        { value: 'temp', label: 'Temporary' },
        { value: 'temp_resid', label: 'Temporary Resident' },
        { value: 'bridging', label: 'Bridging Visa' }
      ]
    },
    read_only: true,
  },
  {
    key: 'work_hours_allowed',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Working Hours Allowed',
      max: 32767,
      type: 'number',
      min: 0
    },
    read_only: true,
  },
  {
    key: 'is_available',
    default: true,
    type: 'checkbox',
    templateOptions: { required: false, label: 'Available', type: 'checkbox' },
    read_only: true,
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contacts',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_contacts',
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
    key: 'subclass',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Subclass Number',
      max: 4,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Visa Type Name',
      max: 255,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'general_type',
    default: 'other',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'General Visa Type',
      type: 'select',
      options: [
        { value: 'visitor', label: 'Visitor' },
        { value: 'working', label: 'Working and Skilled' },
        { value: 'studying', label: 'Studying' },
        { value: 'family', label: 'Family and Spousal' },
        { value: 'refugee', label: 'Refugee and Humanitarian' },
        { value: 'other', label: 'Other' },
        { value: 'repealed', label: 'Repealed' },
        { value: 'temp', label: 'Temporary' },
        { value: 'temp_resid', label: 'Temporary Resident' },
        { value: 'bridging', label: 'Bridging Visa' }
      ]
    },
    read_only: false
  },
  {
    key: 'work_hours_allowed',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Working Hours Allowed',
      max: 32767,
      type: 'number',
      min: 0
    },
    read_only: false
  },
  {
    key: 'is_available',
    default: true,
    type: 'checkbox',
    templateOptions: { required: false, label: 'Available', type: 'checkbox' },
    read_only: false
  }
];

export const visatypes = {
  list,
  form,
  formadd
};
