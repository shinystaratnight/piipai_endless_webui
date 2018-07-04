const list = {
  list: {
    list: 'candidateevaluation',
    label: 'Candidate Evaluation',
    columns: [
      {
        content: [
          {
            endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
            field: 'candidate_contact',
            type: 'related'
          }
        ],
        name: 'candidate_contact',
        sort_field: 'candidate_contact',
        label: 'Candidate contact',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            field: 'supervisor',
            type: 'related'
          }
        ],
        name: 'supervisor',
        sort_field: 'supervisor',
        label: 'Supervisor',
        sort: true
      },
      {
        content: [{ field: 'evaluated_at', type: 'datepicker' }],
        name: 'evaluated_at',
        sort_field: 'evaluated_at',
        label: 'Evaluated at',
        sort: true
      }
    ],
    pagination_label: 'Candidate Evaluation',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'candidate_contact',
        label: 'Candidate contact',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
          key: 'id'
        },
        query: 'candidate_contact'
      }
    ]
  },
  fields: [
    {
      list: false,
      endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
      read_only: true,
      templateOptions: {
        label: 'Candidate contact',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'candidate_contact',
      many: false
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/core/companycontacts/',
      read_only: true,
      templateOptions: {
        label: 'Supervisor',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'supervisor',
      many: false
    },
    {
      key: 'evaluated_at',
      type: 'datepicker',
      templateOptions: {
        required: false,
        label: 'Evaluated at',
        type: 'datetime'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_contact',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Supervisor',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'supervisor',
    many: false
  },
  {
    key: 'evaluated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Evaluated at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'level_of_communication',
    default: 0,
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Level of Communication',
      type: 'select',
      options: [
        { value: 0, label: 'Not Rated' },
        { value: 1, label: 'Impossible' },
        { value: 2, label: 'Hard' },
        { value: 3, label: 'Decent' },
        { value: 4, label: 'Good' },
        { value: 5, label: 'Excellent' }
      ]
    },
    read_only: false
  },
  {
    key: 'was_on_time',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Was on time?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'was_motivated',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Was motivated?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'had_ppe_and_tickets',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Had PPE and tickets?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'met_expectations',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Met Your expectations?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'representation',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Was clean, well presented?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/timesheets/',
    read_only: true,
    templateOptions: {
      label: 'Reference timesheet',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'reference_timesheet',
    many: false
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_contact',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Supervisor',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'supervisor',
    many: false
  },
  {
    key: 'evaluated_at',
    type: 'datepicker',
    templateOptions: {
      required: false,
      label: 'Evaluated at',
      type: 'datetime'
    },
    read_only: false
  },
  {
    key: 'level_of_communication',
    default: 0,
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Level of Communication',
      type: 'select',
      options: [
        { value: 0, label: 'Not Rated' },
        { value: 1, label: 'Impossible' },
        { value: 2, label: 'Hard' },
        { value: 3, label: 'Decent' },
        { value: 4, label: 'Good' },
        { value: 5, label: 'Excellent' }
      ]
    },
    read_only: false
  },
  {
    key: 'was_on_time',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Was on time?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'was_motivated',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Was motivated?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'had_ppe_and_tickets',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Had PPE and tickets?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'met_expectations',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Met Your expectations?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'representation',
    type: 'checkbox',
    templateOptions: {
      required: false,
      label: 'Was clean, well presented?',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/hr/timesheets/',
    read_only: true,
    templateOptions: {
      label: 'Reference timesheet',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'reference_timesheet',
    many: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
