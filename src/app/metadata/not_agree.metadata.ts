const form = [
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
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Shift Ended at'
    },
    read_only: false
  }
];

export const metadata = {
  form
};
