const list = {
  list: {
    list: 'timesheet',
    search_enabled: false,
    pagination_label: 'Timesheet Entry',
    buttons: [],
    columns: [
      {
        label: 'Times',
        delim: null,
        name: 'times',
        title: null,
        content: [
          {
            text: '{shift_started_at__date}',
            type: 'static',
            label: 'Shift date',
            field: 'shift_started_at'
          },
          {
            text: '{shift_started_at__time}',
            type: 'static',
            label: 'Shift started at',
            field: 'shift_started_at'
          },
          {
            text: '{break_started_at__time} - {break_ended_at__time}',
            type: 'static',
            label: 'Break',
            field: 'break_started_at'
          },
          {
            text: '{shift_ended_at__time}',
            type: 'static',
            label: 'Shift ended at',
            field: 'shift_ended_at'
          }
        ]
      },
      {
        label: 'Jobsite',
        delim: null,
        name: 'jobsite',
        sort: true,
        sort_field: 'jobsite',
        title: null,
        content: [
          {
            endpoint: '/ecore/api/v2/hr/jobsites/',
            type: 'related',
            label: 'Jobsite',
            field: 'jobsite'
          }
        ]
      },
      {
        label: 'Going to work',
        delim: null,
        name: 'going_to_work',
        title: null,
        content: [
          {
            type: 'icon',
            label: 'Going to work',
            field: 'going_to_work_confirmation'
          }
        ]
      },
      {
        label: 'Signed by',
        delim: null,
        name: 'signed_by',
        title: null,
        content: [
          {
            showIf: ['supervisor_approved'],
            endpoint: '/ecore/api/v2/core/companycontacts/',
            type: 'related',
            field: 'supervisor'
          },
          { type: 'datepicker', field: 'supervisor_approved_at' }
        ]
      },
      {
        label: '',
        delim: null,
        name: 'id',
        sort: true,
        sort_field: 'id',
        title: null,
        content: [
          {
            text: 'Submit',
            icon: 'fa-pencil',
            type: 'button',
            color: 'success',
            endpoint: '/ecore/api/v2/hr/timesheets-candidate/{id}/submit/',
            field: 'id',
            action: 'changeTimesheet',
            hidden: 'candidate_submit_hidden'
          }
        ]
      }
    ],
    filters: [
      {
        key: 'shift_started_at',
        list: [
          {
            query:
              'shift_started_at_0=2018-07-03&shift_started_at_1=2018-07-03',
            label: 'Yesterday'
          },
          {
            query:
              'shift_started_at_0=2018-07-04&shift_started_at_1=2018-07-04',
            label: 'Today'
          },
          {
            query:
              'shift_started_at_0=2018-07-05&shift_started_at_1=2018-07-05',
            label: 'Tomorrow'
          }
        ],
        type: 'date',
        label: 'Shift date',
        input: [
          { query: 'shift_started_at_0', label: 'From date' },
          { query: 'shift_started_at_1', label: 'To date' }
        ]
      },
      {
        default: null,
        query: 'approved',
        label: 'Status',
        options: [
          { label: 'Approved', value: 'True' },
          { label: 'Unapproved', value: 'False' }
        ],
        key: 'approved',
        type: 'select'
      }
    ],
    editDisable: true,
    label: 'Timesheet Entry'
  },
  fields: [
    {
      key: 'id',
      type: 'button',
      templateOptions: {
        text: 'Submit',
        label: '',
        action: 'changeTimesheet',
        type: 'button'
      },
      read_only: true
    },
    {
      key: 'supervisor_approved_at',
      type: 'datepicker',
      templateOptions: {
        type: 'datetime',
        required: false,
        label: 'Supervisor Approved at'
      },
      read_only: true
    },
    {
      list: false,
      showIf: ['supervisor_approved'],
      many: false,
      collapsed: false,
      read_only: true,
      key: 'supervisor',
      endpoint: '/ecore/api/v2/core/companycontacts/',
      type: 'related',
      templateOptions: {
        edit: true,
        label: 'Supervisor',
        add: true,
        type: 'related',
        delete: false,
        values: ['__str__']
      }
    },
    {
      key: 'going_to_work_confirmation',
      type: 'checkbox',
      templateOptions: {
        type: 'icon',
        required: false,
        label: 'Going to work',
        values: {
          false: 'times-circle',
          true: 'check-circle',
          null: 'minus-circle'
        }
      },
      read_only: true
    },
    {
      key: 'shift_ended_at',
      default: '2018-07-04T15:30:00+10:00',
      type: 'static',
      templateOptions: {
        text: '{shift_ended_at__time}',
        required: false,
        type: 'static',
        label: 'Shift ended at'
      },
      read_only: true
    },
    {
      list: false,
      many: false,
      collapsed: false,
      read_only: true,
      key: 'jobsite',
      endpoint: '/ecore/api/v2/hr/jobsites/',
      type: 'related',
      templateOptions: {
        edit: true,
        label: 'Jobsite',
        add: true,
        type: 'related',
        delete: false,
        values: ['__str__']
      }
    },
    {
      key: 'shift_started_at',
      type: 'static',
      templateOptions: {
        text: '{shift_started_at__date}',
        required: false,
        type: 'static',
        label: 'Shift date'
      },
      read_only: true
    },
    {
      key: 'break_started_at',
      default: '2018-07-04T12:00:00+10:00',
      type: 'static',
      templateOptions: {
        text: '{break_started_at__time} - {break_ended_at__time}',
        required: false,
        type: 'static',
        label: 'Break'
      },
      read_only: true
    }
  ]
};

export const metadata = {
  list
};
