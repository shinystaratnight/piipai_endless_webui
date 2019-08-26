import { Endpoints } from '@webui/data';
import { List } from '@webui/metadata';

const list = function() {
  return {
    list: new List.main.element('timesheet', 'Timesheet history')
      .disableEdit()
      .disableSearch()
      .removeCreateButton()
      .setColumns([
        new List.column.element('job_offer.candidate_contact.contact.picture', 'Picture')
          .setHide()
          .setContent([
            new List.picture.element('job_offer.candidate_contact.contact.picture', false)
        ]),

        new List.column.element('position', 'Position')
          .setHide()
          .setContent([
            new List.link.element('job_offer.candidate_contact', 'showCandidateProfile')
              .setEndpoint(`${Endpoints.CandidateContact}{job_offer.candidate_contact.id}/`),

            new List.static.element('position'),

            new List.static.element('jobsite')
          ]),

        new List.column.element('personal_info', 'Candidate/Position')
          .setSort(true, 'job_offer.candidate_contact')
          .setContent([
            new List.info.element('id')
              .setValues({
                title: 'job_offer.candidate_contact.contact.__str__',
                picture: 'job_offer.candidate_contact.contact.picture.origin',
                position: 'position.__str__'
              })
          ]),

        new List.column.element('tracking', 'Tracking')
          .setCenter()
          .setContent([
            new List.button.element('id', 'showTracking')
              .setEndpoint(`${Endpoints.CandidateLocation}{job_offer.candidate_contact.id}/history/`)
              .setCustomLink('/assets/img/map-lg.jpg')
              .setShowIfRule([{ status: [4, 5, 6, 7] }])
          ]),

        new List.column.element('times', 'Times')
          .setSort(true, 'shift_started_at')
          .setContent([
            new List.static.element('shift_started_at')
              .setDisplay('{shift_started_at__date}')
              .setLabel('Shift date'),

            new List.static.element('shift_started_at')
              .setDisplay('{shift_started_at__time} - {shift_ended_at__time}')
              .setLabel('Shift start/end'),

            new List.static.element('break_started_at')
              .setDisplay('{break_started_at__time} - {break_ended_at__time}')
              .setLabel('Break start/end')
          ]),

        new List.column.element('totalTime', 'Total time')
          .setContent([
            new List.static.element('totalTime')
              .setDisplay('{totalTime}')
              .changeColor('success', 'shift_ended_at')
          ]),

        new List.column.element('evaluate', 'Evaluate')
          .setContent([
            new List.button.element('id', 'evaluateCandidate')
              .setEndpoint(`${Endpoints.Timesheet}{id}/evaluate/`)
              .setDisplay('Evaluate')
              .customButton('warning', 'evaluate')
              .setShowIfRule([{ evaluated: false }]),

            new List.text.element('evaluation.evaluation_score')
              .scoreField()
              .setShowIfRule([ { evaluated: true } ])
          ]),

        new List.column.element('approve', 'Approve/Change')
          .setHide()
          .setContent([
            new List.button.element('id', 'approveTimesheet')
              .setDisplay('Approve')
              .setEndpoint(`${Endpoints.Timesheet}{id}/approve/`)
              .setShowIfRule([{ supervisor_approved_at: null }])
              .customButton('success', 'approve'),
          ]),

        new List.column.element('change', 'Change')
          .setHide()
          .setContent([
            new List.button.element('id', 'changeTimesheet')
              .setEndpoint(`${Endpoints.Timesheet}{id}/not_agree/`)
              .setDisplay('Change')
              .customButton('danger', 'change')
              .setShowIfRule([ { supervisor_approved_at: null } ])
          ]),

        new List.column.element('status', 'Status')
          .setContent([
          new List.static.element('status')
            .setHideValue(true),

          new List.static.element('supervisor_approved')
            .setDisplay('Approved')
            .changeColor('success', 'supervisor_approved')
            .setShowIfRule([ { status: 7 } ]),

          new List.static.element('supervisor.name')
            .setShowIfRule([ { status: 7 } ]),

          new List.static.element('supervisor_approved_at')
            .setDisplay('{supervisor_approved_at__datetime}')
            .setStyles(['muted'])
            .setShowIfRule([
              { status: 7 },
              'supervisor_approved_at',
              { supervisor_modified_at: null }
            ]),

          new List.picture.element('supervisor_signature', false)
            .setSignature()
            .setShowIfRule([
              { status: 7 },
              'supervisor_signature.origin'
            ]),

          new List.static.element('status')
            .setDisplay('Waiting submission')
            .changeColor('danger', 'status')
            .setShowIfRule([ { status: 4 } ]),

          new List.static.element('status')
            .setDisplay('Adjustment in progress')
            .changeColor('primary', 'status')
            .setInfoText('Timesheet will be automatically approved in 4 hours')
            .setShowIfRule([ { status: 6 } ]),

          new List.static.element('supervisor_modified_at')
            .setDisplay('{supervisor_modified_at__datetime}')
            .setStyles(['muted'])
            .setShowIfRule([
              { status: 6 },
              'supervisor_modified_at'
            ]),

          new List.button.element('id', 'changeTimesheet')
            .setDisplay('Change')
            .setEndpoint(`${Endpoints.Timesheet}{id}/not_agree/`)
            .setShowIfRule([{ status: 6 }])
            .customButton('danger', 'change'),

          new List.button.element('id', 'approveTimesheet')
            .setDisplay('Approve')
            .setEndpoint(`${Endpoints.Timesheet}{id}/approve/`)
            .setShowIfRule([{ status: 5 }])
            .customButton('success', 'approve'),

          new List.button.element('id', 'changeTimesheet')
            .setDisplay('Change')
            .setEndpoint(`${Endpoints.Timesheet}{id}/not_agree/`)
            .setShowIfRule([{ status: 5 }])
            .customButton('danger', 'change')
        ])
    ]),
  };
};

export const history = {
  list,
  formset: list
};
