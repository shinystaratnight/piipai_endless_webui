const shiftStartField = {
  key: 'shift_started_at',
  type: 'datepicker',
  updateFromForm: true,
  templateOptions: {
    showTime: true,
    type: 'datetime',
    required: false,
    label: 'Shift start'
  },
  read_only: false
};

const shiftEndField = {
  key: 'shift_ended_at',
  type: 'datepicker',
  updateFromForm: true,
  templateOptions: {
    showTime: true,
    type: 'datetime',
    required: false,
    label: 'Shift end'
  },
  read_only: false
};

const breakStartField = {
  key: 'break_started_at',
  type: 'datepicker',
  updateFromForm: true,
  saveField: true,
  templateOptions: {
    showTime: true,
    type: 'datetime',
    required: false,
    label: 'Break start'
  },
  showIf: [{ noBreak: false }],
  read_only: false
};

const breakEndField = {
  key: 'break_ended_at',
  type: 'datepicker',
  updateFromForm: true,
  saveField: true,
  templateOptions: {
    showTime: true,
    type: 'datetime',
    required: false,
    label: 'Break end'
  },
  showIf: [{ noBreak: false }],
  read_only: false
};

const totalTimeField = {
  type: 'static',
  key: 'total_time',
  send: false,
  read_only: true,
  templateOptions: {
    label: 'Total time',
    color: 'text-success'
  }
};

const noBreakField = {
  type: 'checkbox',
  key: 'noBreak',
  default: false,
  send: false,
  updateFromForm: true,
  setNull: ['break_started_at', 'break_ended_at'],
  templateOptions: {
    label: 'No Break'
  }
};

const signatureField = {
  type: 'input',
  key: 'supervisor_signature',
  hide: true,
  templateOptions: {
    type: 'picture'
  }
};

const form = [
  {
    type: 'row',
    children: [
      {
        type: 'group',
        hideLabel: true,
        marginBottom: 12,
        children: [noBreakField, shiftStartField, shiftEndField, totalTimeField]
      },
      {
        type: 'group',
        marginBottom: 12,
        children: [breakStartField, breakEndField, signatureField]
      }
    ]
  }
];

const mobile = [
  noBreakField,
  shiftStartField,
  breakStartField,
  breakEndField,
  shiftEndField,
  totalTimeField,
  signatureField
];

export const metadata = {
  form,
  mobile
};
