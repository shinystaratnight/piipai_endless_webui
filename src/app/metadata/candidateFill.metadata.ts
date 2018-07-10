const form = [
  {
    key: 'shift_started_at',
    type: 'datepicker',
    default: '2018-07-10T07:00:00+10:00',
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
    default: '2018-07-10T15:30:00+10:00',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Shift Ended at'
    },
    read_only: false
  },
  {
    key: 'no_break',
    type: 'checkbox',
    templateOptions: { type: 'checkbox', required: false, label: 'No Break' },
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
    default: '2018-07-10T12:00:00+10:00',
    read_only: false,
    showIf: [{ no_break: false }]
  },
  {
    key: 'break_ended_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Break Ended at'
    },
    default: '2018-07-10T12:30:00+10:00',
    read_only: false,
    showIf: [{ no_break: false }]
  },
  {
    key: 'total_worked',
    type: 'static',
    templateOptions: { type: 'static', required: false, label: 'Total' },
    read_only: true
  },
  {
    key: 'send_supervisor_message',
    type: 'checkbox',
    templateOptions: {
      type: 'checkbox',
      required: false,
      label: 'Send confirmation message to supervisor'
    },
    read_only: false
  }
];

export const metadata = {
  form
};
