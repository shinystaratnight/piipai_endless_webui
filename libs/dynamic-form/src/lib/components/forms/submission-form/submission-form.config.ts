import { SkillModel } from '@webui/data';
import { CheckboxType, DatepickerType, Form } from '@webui/metadata';

export const details = [
  new Form.row.element().setChildren([
    new Form.group.element()
      .doNotShowLabel()
      .setChildren([
        new Form.static.element('supervisor', 'Supervisor').readOnly(),

        new Form.static.element('company', 'Company').readOnly(),

        new Form.static.element('shift_date', 'Shift date')
          .readOnly()
          .doNotSend()
      ]),
    new Form.group.element().doNotShowLabel().setChildren([
      new Form.static.element('jobsite', 'Jobsite').readOnly(),

      new SkillModel()
        .formElement({
          key: 'position',
          label: 'Position'
        })
        .updateValues(['name'])
        .readOnly()
        .updateModel({
          editForm: true
        })
    ])
  ])
];

export const times = [
  new Form.row.element().setChildren([
    new Form.group.element()
      .doNotShowLabel()
      .setChildren([
        new Form.datepicker.element(
          'shift_started_at',
          'Shift Start',
          DatepickerType.Datetime
        )
          .setWidth(0.25)
          .required(),

        new Form.static.element('total_time', 'Total time')
          .setWidth(0.25)
          .readOnly()
          .doNotSend()
          .setColor('text-success')
          .inlineValue()
      ]),

    new Form.group.element()
      .doNotShowLabel()
      .setChildren([
        new Form.datepicker.element(
          'shift_ended_at',
          'Shift End',
          DatepickerType.Datetime
        )
          .setWidth(0.25)
          .required(),

        new Form.checkbox.element('noBreak', 'No Break', CheckboxType.Checkbox)
          .setDefaultValue(false)
          .updateByNull(['break_started_at', 'break_ended_at'])
          .setWidth(0.25)
          .doNotSend()
      ]),

    new Form.group.element().doNotShowLabel().setChildren([
      new Form.datepicker.element(
        'break_started_at',
        'Break Start',
        DatepickerType.Datetime
      )
        .setWidth(0.25)
        .saveValue()
        .setShowIfRule([{ noBreak: false }])
    ]),

    new Form.group.element().doNotShowLabel().setChildren([
      new Form.datepicker.element(
        'break_ended_at',
        'Break End',
        DatepickerType.Datetime
      )
        .setWidth(0.25)
        .saveValue()
        .setShowIfRule([{ noBreak: false }])
    ])
  ])
];
