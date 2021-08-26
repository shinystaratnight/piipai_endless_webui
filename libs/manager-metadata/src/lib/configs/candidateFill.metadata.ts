import { Endpoints, Models } from '@webui/data';
import { CheckboxType, Form } from '@webui/metadata';

const form = [
  new Form.checkbox.element(
    'hours',
    'Times only',
    CheckboxType.Checkbox
  ).setDefaultValue(true),
  {
    key: 'shift_started_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Shift Started at'
    },
    read_only: false,
    showIf: [{ hours: true }]
  },
  {
    key: 'shift_ended_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Shift Ended at'
    },
    read_only: false,
    showIf: [{ hours: true }]
  },
  {
    key: 'no_break',
    type: 'checkbox',
    templateOptions: { type: 'checkbox', required: false, label: 'No Break' },
    read_only: false,
    showIf: [{ hours: true }]
  },
  {
    key: 'break_started_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Break Started at'
    },
    read_only: false,
    showIf: [{ hours: true }]
  },
  {
    key: 'break_ended_at',
    type: 'datepicker',
    templateOptions: {
      type: 'datetime',
      required: false,
      label: 'Break Ended at'
    },
    read_only: false,
    showIf: [{ hours: true }]
  },
  new Form.select.element('wage_type', 'Wage Type')
    .setDefaultValue(0)
    .addOptions({
      '0': 'Hourly wage',
      '1': 'Piecework wage'
    }),
  {
    key: 'total_worked',
    type: 'static',
    templateOptions: { type: 'static', required: false, label: 'Total' },
    read_only: true,
    showIf: [{ hours: true }]
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
  },
  new Form.list.element('Skill Activities', Endpoints.TimesheetRates)
    .setShowIfRule([
      {
        hours: false
      }
    ])
    .setQuery({
      timesheet: '{id}'
    })
    .setPrefilledFields({
      [Models.Skill]: '{position.id}',
      [Models.Timesheet]: '{id}',
      company: '{company.id}'
    })
];

export const candidateFill = {
  form
};
