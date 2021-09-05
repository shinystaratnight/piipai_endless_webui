import {
  Endpoints,
  Models,
  NoteModel,
  SkillModel,
  SkillWorkTypeModel
} from '@webui/data';
import { CheckboxType, DatepickerType, Form, InputType } from '@webui/metadata';

export const details = () => [
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

export const times = () => [
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

        new Form.checkbox.element('noBreak', 'No Break', CheckboxType.Checkbox)
          .setDefaultValue(false)
          .updateByNull(['break_started_at', 'break_ended_at'])
          .setWidth(0.25)
          .doNotSend()
      ]),

    new Form.group.element()
      .doNotShowLabel()
      .setChildren([
        new Form.datepicker.element(
          'shift_ended_at',
          'Shift End',
          DatepickerType.Datetime
        )
          .setDefaultValue('{shift_ended_at}')
          .setWidth(0.25)
          .required(),

        new Form.static.element('total_time', 'Total time')
          .setWidth(0.25)
          .readOnly()
          .doNotSend()
          .setColor('text-success')
          .inlineValue()
      ]),

    new Form.group.element().doNotShowLabel().setChildren([
      new Form.datepicker.element(
        'break_started_at',
        'Break Start',
        DatepickerType.Datetime
      )
        .setDefaultValue('{break_started_at}')
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
        .setDefaultValue('{break_ended_at}')
        .setWidth(0.25)
        .saveValue()
        .setShowIfRule([{ noBreak: false }])
    ])
  ])
];

export const skillActivities = () => [
  new Form.list.element(
    'Skill Activities',
    Endpoints.TimesheetRates,
    'timesheetrates'
  )
    .setQuery({
      timesheet: '{id}'
    })
    .setPrefilledFields({
      [Models.Skill]: '{position.id}',
      [Models.Timesheet]: '{id}',
      company: '{company.id}'
    })
];

export const notes = () => [
  new NoteModel().formListElement({
    model_content_type: '112'
  })
];

export const workType = () => [
  new Form.input.element('timesheet', 'Timesheet', InputType.Text)
    .setDefaultValue('{id}')
    .hideField(),
  new SkillWorkTypeModel()
    .formElement()
    .readOnly()
    .required()
    .updateValues(['translations', 'uom', 'skill_rate_ranges'])
    .setQuery({
      skill: '{position.id}',
      company: '{company.id}',
      priced: true
    }),
  new SkillModel().formElement().updateValues(['name']).hideField(),
  new Form.input.element('rate', 'Rate', InputType.Number)
    .setDefaultValue('{worktype.skill_rate_ranges.default_rate}')
    .hideField(),
  new Form.input.element('value', 'Value', InputType.Number).setIcon(
    '{worktype.uom.short_name}'
  )
];
