const list = {
  list: {
    list: 'candidateevaluation',
    label: 'Candidate Evaluation',
    columns: [
      {
        content: [
          {
            endpoint: '/candidate/candidatecontacts/',
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
            endpoint: '/core/companycontacts/',
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
          endpoint: '/candidate/candidatecontacts/',
          key: 'id'
        },
        query: 'candidate_contact'
      }
    ]
  },
  fields: [
    {
      list: false,
      endpoint: '/candidate/candidatecontacts/',
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
      endpoint: '/core/companycontacts/',
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

const formset = {
  fields: [
    {
      key: 'had_ppe_and_tickets',
      read_only: false,
      templateOptions: {
        required: false,
        values: { false: 'times', true: 'check', null: 'minus-circle' },
        label: 'Had ppe and tickets',
        type: 'icon'
      },
      type: 'checkbox'
    },
    {
      key: 'met_expectations',
      read_only: false,
      templateOptions: {
        required: false,
        values: { false: 'times', true: 'check', null: 'minus-circle' },
        label: 'Met expectations',
        type: 'icon'
      },
      type: 'checkbox'
    },
    {
      key: 'was_motivated',
      read_only: false,
      templateOptions: {
        required: false,
        values: { false: 'times', true: 'check', null: 'minus-circle' },
        label: 'Was motivated',
        type: 'icon'
      },
      type: 'checkbox'
    },
    {
      key: 'representation',
      read_only: false,
      templateOptions: {
        required: false,
        values: { false: 'times', true: 'check', null: 'minus-circle' },
        label: 'Representation',
        type: 'icon'
      },
      type: 'checkbox'
    },
    {
      key: 'reference_timesheet',
      templateOptions: { link: null, label: '', type: 'link', text: '' },
      type: 'link'
    },
    {
      key: 'evaluated_at',
      read_only: true,
      templateOptions: {
        required: false,
        label: 'Evaluated at',
        type: 'datetime'
      },
      type: 'datepicker'
    },
    {
      key: 'was_on_time',
      read_only: false,
      templateOptions: {
        required: false,
        values: { false: 'times', true: 'check', null: 'minus-circle' },
        label: 'Was on time',
        type: 'icon'
      },
      type: 'checkbox'
    },
    {
      many: false,
      key: 'supervisor',
      endpoint: '/core/companycontacts/',
      collapsed: false,
      list: false,
      templateOptions: {
        add: true,
        delete: false,
        edit: true,
        values: ['__str__'],
        label: 'Supervisor',
        type: 'related'
      },
      read_only: true,
      type: 'related'
    },
    {
      default: 0,
      key: 'level_of_communication',
      read_only: false,
      templateOptions: {
        required: false,
        label: 'Level of communication',
        type: 'skills',
        options: [
          { value: 0, label: 'Not Rated' },
          { value: 1, label: 'Impossible' },
          { value: 2, label: 'Hard' },
          { value: 3, label: 'Decent' },
          { value: 4, label: 'Good' },
          { value: 5, label: 'Excellent' }
        ]
      },
      type: 'skills'
    }
  ],
  list: {
    columns: [
      {
        name: 'supervisor',
        sort: true,
        sort_field: 'supervisor',
        content: [
          {
            endpoint: '/core/companycontacts/',
            type: 'related',
            field: 'supervisor'
          }
        ],
        label: 'Supervisor'
      },
      {
        name: 'level_of_communication',
        sort: true,
        sort_field: 'level_of_communication',
        label: 'Evaluation',
        content: [
          {
            display: 'Score',
            type: 'skills',
            field: 'level_of_communication'
          }
        ],
      },
      {
        name: 'evaluated_at',
        sort: true,
        sort_field: 'evaluated_at',
        content: [{ type: 'datepicker', field: 'evaluated_at' }],
        label: 'Evaluated at'
      },
      {
        name: 'reference_timesheet',
        sort_field: 'reference_timesheet',
        title: null,
        sort: true,
        content: [
          {
            text: 'Open TimeSheet',
            color: 'primary',
            endpoint: '/hr/timesheets/{reference_timesheet.id}',
            label: 'reference_timesheet',
            type: 'link',
            field: 'reference_timesheet'
          }
        ],
        label: 'Related timesheet',
        delim: null
      },
    ],
    list: 'candidateevaluation',
    editDisable: false,
    label: 'Candidate Evaluation',
    pagination_label: 'Candidate Evaluation',
    search_enabled: false
  }
};

const form = [
  {
    list: false,
    endpoint: '/candidate/candidatecontacts/',
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
    endpoint: '/core/companycontacts/',
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
    endpoint: '/hr/timesheets/',
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
    endpoint: '/candidate/candidatecontacts/',
    read_only: true,
    templateOptions: {
      label: 'Candidate contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
    type: 'related',
    key: 'candidate_contact',
    many: false
  },
  {
    list: false,
    endpoint: '/core/companycontacts/',
    read_only: true,
    templateOptions: {
      label: 'Supervisor',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    visibleMode: true,
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
    endpoint: '/hr/timesheets/',
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
  formset,
  form,
  formadd
};
