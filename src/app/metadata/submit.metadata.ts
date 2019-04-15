const form = [
  {
    children: [
      {
        key: 'supervisor',
        type: 'static',
        templateOptions: {
          type: 'static',
          required: false,
          label: 'Supervisor'
        },
        read_only: true
      },
      {
        key: 'company',
        type: 'static',
        templateOptions: { type: 'static', required: false, label: 'Company' },
        read_only: true
      },
      {
        key: 'jobsite',
        type: 'static',
        templateOptions: { type: 'static', required: false, label: 'Jobsite' },
        read_only: true
      },
      {
        key: 'position',
        type: 'static',
        templateOptions: { type: 'static', required: false, label: 'Position' },
        read_only: true,
      },
    ],
    type: 'row'
  },
  {
    type: 'row',
    children: [
      {
        width: 0.25,
        type: 'static',
        key: 'total_time',
        send: false,
        read_only: true,
        templateOptions: {
          label: 'Total time',
          color: 'text-success',
          bold: true,
        }
      },
      {
        width: 0.25,
        type: 'checkbox',
        key: 'noBreak',
        default: false,
        hide: true,
        send: false,
        setNull: ['break_started_at', 'break_ended_at'],
        templateOptions: {
          label: 'No Break',
        },
      },
      {
        width: 0.25,
        type: 'button',
        color: 'primary',
        templateOptions: {
          title: 'Break',
          action: 'noBreak',
          text: 'No Break',
          type: 'button',
        }
      },
    ]
  },
  {
    children: [
      {
        key: 'shift_started_at',
        type: 'datepicker',
        templateOptions: {
          type: 'datetime',
          required: false,
          label: 'Shift Started at'
        },
        read_only: false
      },
      {
        key: 'shift_ended_at',
        type: 'datepicker',
        templateOptions: {
          type: 'datetime',
          required: false,
          label: 'Shift Ended at'
        },
        read_only: false
      },
      {
        type: 'group',
        hideLabel: true,
        children: [
          {
            key: 'break_started_at',
            type: 'datepicker',
            templateOptions: {
              type: 'datetime',
              required: false,
              label: 'Break Started at'
            },
            saveField: true,
            read_only: false,
            showIf: [{ noBreak: false }]
          },
        ]
      },
      {
        type: 'group',
        hideLabel: true,
        children: [
          {
            key: 'break_ended_at',
            type: 'datepicker',
            templateOptions: {
              type: 'datetime',
              required: false,
              label: 'Break Ended at'
            },
            saveField: true,
            read_only: false,
            showIf: [{ noBreak: false }],
          },
        ]
      },
    ],
    type: 'row'
  }
];

export const metadata = {
  form,
  list: {}
};
