const form = [
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
        key: 'break_started_at',
        default: '2018-07-05T12:00:00+10:00',
        type: 'datepicker',
        templateOptions: {
          type: 'datetime',
          required: false,
          label: 'Break Started at'
        },
        read_only: false
      },
      {
        key: 'break_ended_at',
        default: '2018-07-05T12:30:00+10:00',
        type: 'datepicker',
        templateOptions: {
          type: 'datetime',
          required: false,
          label: 'Break Ended at'
        },
        read_only: false
      },
      {
        key: 'shift_ended_at',
        default: '2018-07-05T15:30:00+10:00',
        type: 'datepicker',
        templateOptions: {
          type: 'datetime',
          required: false,
          label: 'Shift Ended at'
        },
        read_only: false
      }
    ],
    type: 'row'
  }
];

export const metadata = {
  form
};
