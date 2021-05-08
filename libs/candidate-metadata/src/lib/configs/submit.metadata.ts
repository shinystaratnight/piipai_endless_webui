import { Endpoints, Models, SkillModel } from '@webui/data';
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

        new SkillModel()
          .formElement({
            key: 'position',
            label: 'Position'
          })
          .updateValues(['name'])
          .readOnly()
          .updateModel({
            editForm: true,
          }),
      ]),

    new Form.row.element()
      .noBorder()
      .setChildren([
        new Form.collapse.element('Times', 'times', true)
          .setChildren([
            new Form.row.element()
              .noBorder()
              .setChildren([
                new Form.datepicker.element('shift_started_at', 'Shift Start', DatepickerType.Datetime)
                  .setWidth(0.25),

                new Form.datepicker.element('shift_ended_at', 'Shift End', DatepickerType.Datetime)
                  .setWidth(0.25),

                new Form.datepicker.element('break_started_at', 'Break Start', DatepickerType.Datetime)
                  .setWidth(0.25)
                  .saveValue()
                  .setShowIfRule([ { noBreak: false } ]),

                new Form.datepicker.element('break_ended_at', 'Break End', DatepickerType.Datetime)
                  .setWidth(0.25)
                  .saveValue()
                  .setShowIfRule([ { noBreak: false } ]),
              ]),

            new Form.row.element()
              .noBorder()
              .setChildren([
                new Form.static.element('total_time', 'Total time')
                  .setWidth(0.25)
                  .readOnly()
                  .doNotSend()
                  .setColor('text-success')
                  .inlineValue(),

                new Form.checkbox.element('noBreak', 'No Break', CheckboxType.Checkbox)
                  .setDefaultValue(false)
                  .updateByNull(['break_started_at', 'break_ended_at'])
                  .setWidth(0.25)
                  .doNotSend(),
              ]),
          ])
      ]),

    new Form.list.element('Skill Activities', Endpoints.TimesheetRates, 'timesheetrates')
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
