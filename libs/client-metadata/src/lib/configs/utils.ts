import { List } from '@webui/metadata';
import { Endpoints } from '@webui/data';

export function getPictureColumn() {
  return new List.column.element(
    'job_offer.candidate_contact.contact.picture',
    'Picture'
  )
    .setHide()
    .setContent([
      new List.picture.element(
        'job_offer.candidate_contact.contact.picture',
        false
      )
    ]);
}

export function getPositionColumn() {
  return new List.column.element('position', 'Position')
    .setHide()
    .setContent([
      new List.link.element(
        'job_offer.candidate_contact',
        'showCandidateProfile'
      ).setEndpoint(
        `${Endpoints.CandidateContact}{job_offer.candidate_contact.id}/`
      ),

      new List.static.element('position'),
      new List.static.element('jobsite').setDescriptionStyle()
    ]);
}

export function getPersonalInfoColumn() {
  return new List.column.element('personal_info', 'Candidate/Position')
    .setSort(true, 'job_offer.candidate_contact')
    .setWidth(255)
    .setContent([
      new List.info.element('id').setValues({
        title: 'job_offer.candidate_contact.contact.__str__',
        picture: 'job_offer.candidate_contact.contact.picture.origin',
        position: 'position.__str__'
      })
    ]);
}

export function getTrackingElement() {
  return new List.button.element('id', 'showTracking')
    .setEndpoint(
      `${Endpoints.CandidateLocation}{job_offer.candidate_contact.id}/history/`
    )
    .setCustomLink('/assets/img/map-lg.jpg');
}

export function getTimesColumn() {
  return new List.column.element('times', 'Times')
    .setSort(true, 'shift_started_at')
    .setContent([
      new List.static.element('shift_started_at')
        .setLabel('Shift date')
        .setDisplay('{shift_started_at__date}'),

      new List.static.element('shift_started_at')
        .setLabel('Shift start/end')
        .setDisplay('{shift_started_at__time} - {shift_ended_at__time}'),

      new List.static.element('break_started_at')
        .setLabel('Break start/end')
        .setDisplay('{break_started_at__time} - {break_ended_at__time}')
    ]);
}

export function getTotalTimeColumn() {
  return new List.column.element('totalTime', 'Total time').setContent([
    new List.static.element('totalTime')
      .setDisplay('{totalTime}')
      .changeColor('success', 'shift_ended_at')
  ]);
}

export function getEvaluateColumn() {
  return new List.column.element('evaluate', 'Evaluate')
    .setWidth(115)
    .setContent([
      new List.button.element('id', 'evaluateCandidate')
        .setEndpoint(`${Endpoints.Timesheet}{id}/evaluate/`)
        .setDisplay('Evaluate')
        .customButton('warning', 'evaluate')
        .setShowIfRule([{ evaluated: false }]),

      new List.text.element('evaluation.evaluation_score')
        .scoreField()
        .setShowIfRule([{ evaluated: true }])
    ]);
}

export function getChangeButton() {
  return new List.button.element('id', 'changeTimesheet')
    .setDisplay('Change')
    .setEndpoint(`${Endpoints.Timesheet}{id}/not_agree/`)
    .customButton('danger', 'change');
}

export function getApproveButton() {
  return new List.button.element('id', 'approveTimesheet')
    .setDisplay('Approve')
    .setEndpoint(`${Endpoints.Timesheet}{id}/approve/`)
    .customButton('success', 'approve');
}
