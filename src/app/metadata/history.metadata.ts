const list = {
  list: {
    list: 'timesheet',
    search_enabled: false,
    pagination_label: 'Timesheet history',
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
            text: '{shift_started_at__time}',
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
        title: null,
        content: [
          { type: 'static', field: 'jobsite' },
          {
            endpoint: '/core/companycontacts/',
            type: 'related',
            field: 'supervisor'
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
            endpoint: '/core/companycontacts/',
            type: 'related',
            field: 'supervisor'
          },
          { type: 'datepicker', field: 'supervisor_approved_at' }
        ]
      }
    ],
    editDisable: true,
    label: 'Timesheet history'
  },
  fields: [
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
      many: false,
      collapsed: false,
      read_only: true,
      key: 'supervisor',
      endpoint: '/core/companycontacts/',
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
      default: '2018-07-05T15:30:00+10:00',
      type: 'static',
      templateOptions: {
        text: '{shift_started_at__time}',
        required: false,
        type: 'static',
        label: 'Shift ended at'
      },
      read_only: true
    },
    {
      key: 'jobsite',
      type: 'static',
      templateOptions: { type: 'static', required: false, label: 'Jobsite' },
      read_only: true
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
      default: '2018-07-05T12:00:00+10:00',
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
  list,
  formset: list
};
