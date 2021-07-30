import { Endpoints, Models, NoteModel, WageType } from '@webui/data';
import { Form, DatepickerType, CheckboxType, InputType } from '@webui/metadata';

const shiftStartField = function () {
  return new Form.datepicker.element(
    'shift_started_at',
    'Shift start',
    DatepickerType.Datetime
  )
    .setShowTime()
    .setUpdateFromForm();
};

const shiftEndField = function () {
  return new Form.datepicker.element(
    'shift_ended_at',
    'Shift end',
    DatepickerType.Datetime
  )
    .setShowTime()
    .setUpdateFromForm();
};

const breakStartField = function () {
  return new Form.datepicker.element(
    'break_started_at',
    'Break start',
    DatepickerType.Datetime
  )
    .setShowIfRule([{ noBreak: false }])
    .saveValue()
    .setShowTime()
    .setUpdateFromForm();
};

const breakEndField = function () {
  return new Form.datepicker.element(
    'break_ended_at',
    'Break end',
    DatepickerType.Datetime
  )
    .setShowIfRule([{ noBreak: false }])
    .saveValue()
    .setShowTime()
    .setUpdateFromForm();
};

const totalTimeField = function () {
  return new Form.static.element('total_time', 'Total time')
    .readOnly()
    .doNotSend()
    .setColor('text-success');
};

const noBreakField = function () {
  return new Form.checkbox.element('noBreak', 'No Break', CheckboxType.Checkbox)
    .setUpdateFromForm()
    .doNotSend()
    .updateByNull(['break_started_at', 'break_ended_at']);
};

const signatureField = function () {
  return new Form.input.element(
    'supervisor_signature',
    '',
    InputType.Picture
  ).hideField();
};

const form = function () {
  return [
    new Form.collapse.element('Times', 'times', true)
      .setIsCollapsed((data: any) => {
        const { wage_type } = data;

        return wage_type != WageType.Hourly;
      })
      .setChildren([
        new Form.row.element().setChildren([
          new Form.group.element()
            .doNotShowLabel()
            .setChildren([
              shiftStartField(),
              shiftEndField(),
              noBreakField(),
              totalTimeField()
            ]),

          new Form.group.element()
            .doNotShowLabel()
            .setChildren([breakStartField(), breakEndField()])
        ])
      ]),

    new Form.list.element('Skill Activities', Endpoints.TimesheetRates, 'timesheetrates')
      .setQuery({
        timesheet: '{id}'
      })
      .setPrefilledFields({
        [Models.Skill]: '{position.id}',
        [Models.Timesheet]: '{id}'
      }),

    new NoteModel().formListElement({
        model_content_type: '112'
      })
  ];
};

const mobile = function () {
  return [
    noBreakField(),
    shiftStartField(),
    breakStartField(),
    breakEndField(),
    shiftEndField(),
    totalTimeField(),
    new Form.list.element('Skill Activities', Endpoints.TimesheetRates)
      .setQuery({
        timesheet: '{id}'
      })
      .setPrefilledFields({
        [Models.Skill]: '{position.id}',
        [Models.Timesheet]: '{id}'
      }),
    signatureField()
  ];
};

export const notAgree = {
  form,
  mobile
};
