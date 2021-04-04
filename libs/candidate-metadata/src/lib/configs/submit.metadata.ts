import { Endpoints, Models } from '@webui/data';
import { Form, CheckboxType, DatepickerType, InputType } from '@webui/metadata';

const form = function() {
  return [
    new Form.row.element()
      .setChildren([
        new Form.static.element('supervisor', 'Supervisor')
          .readOnly(),

        new Form.static.element('company', 'Company')
          .readOnly(),

        new Form.static.element('jobsite', 'Jobsite')
          .readOnly(),

        new Form.static.element('position', 'Position')
          .readOnly(),
      ]),

    new Form.row.element()
      .noBorder()
      .setChildren([
        new Form.group.element('Times', 'times')
          .setChildren([
            new Form.checkbox.element('noBreak', 'No Break', CheckboxType.Checkbox)
              .setDefaultValue(false)
              .updateByNull(['break_started_at', 'break_ended_at'])
              .setWidth(0.25)
              .doNotSend()
          ])
      ]),

    new Form.row.element()
      .noBorder()
      .setChildren([
        new Form.datepicker.element('shift_started_at', 'Shift Start', DatepickerType.Datetime),

        new Form.datepicker.element('break_started_at', 'Break Start', DatepickerType.Datetime)
          .saveValue()
          .setShowIfRule([ { noBreak: false } ]),

        new Form.datepicker.element('break_ended_at', 'Break End', DatepickerType.Datetime)
          .saveValue()
          .setShowIfRule([ { noBreak: false } ]),

        new Form.datepicker.element('shift_ended_at', 'Shift End', DatepickerType.Datetime)
      ]),

    new Form.row.element()
      .setChildren([
        new Form.static.element('total_time', 'Total time')
          .readOnly()
          .doNotSend()
          .setColor('text-success')
          .inlineValue()
      ]),

    new Form.list.element('Skill Activities', Endpoints.TimesheetRates)
      .setQuery({
        timesheet: '{id}'
      })
      .setPrefilledFields({
        [Models.Skill]: '{position.id}',
        [Models.Timesheet]: '{id}',
      }),
  ]
};

export const metadataSubmit = {
  form,
  list: {}
};
