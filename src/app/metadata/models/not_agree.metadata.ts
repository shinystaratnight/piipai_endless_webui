const form = [
  {
    type: 'row',
    children: [
      {
        type: 'group',
        marginBottom: 12,
        children: [
          {
            key: 'shift_started_at',
            type: 'datepicker',
            templateOptions: {
              showTime: true,
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
              showTime: true,
              type: 'datetime',
              required: false,
              label: 'Shift Ended at'
            },
            read_only: false
          },
          {
            type: 'static',
            key: 'total_time',
            send: false,
            read_only: true,
            templateOptions: {
              label: 'Total time',
              color: 'text-success',
            }
          },
        ]
      },
      {
        type: 'group',
        hideLabel: true,
        children: [
          {
            type: 'checkbox',
            key: 'noBreak',
            default: false,
            send: false,
            setNull: ['break_started_at', 'break_ended_at'],
            templateOptions: {
              label: 'No Break',
            },
          },
          {
            key: 'break_started_at',
            type: 'datepicker',
            templateOptions: {
              showTime: true,
              type: 'datetime',
              required: false,
              label: 'Break Started at'
            },
            showIf: [{ noBreak: false }],
            read_only: false
          },
          {
            key: 'break_ended_at',
            type: 'datepicker',
            templateOptions: {
              showTime: true,
              type: 'datetime',
              required: false,
              label: 'Break Ended at'
            },
            showIf: [{ noBreak: false }],
            read_only: false
          },
        ]
      }
    ]
  },
];

export const metadata = {
  form
};
