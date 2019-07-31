import { Endpoints } from '@webui/data';

const list = {
  list: {
    list: 'timesheet',
    search_enabled: false,
    editDisable: true,
    label: 'Timesheet history',
    buttons: [],
    columns: [
      {
        label: 'Picture',
        delim: null,
        hide: true,
        name: 'job_offer.candidate_contact.contact.picture',
        title: null,
        content: [
          {
            type: 'picture',
            field: 'job_offer.candidate_contact.contact.picture',
            file: false
          }
        ]
      },
      {
        label: 'Position',
        delim: null,
        hide: true,
        name: 'position',
        title: null,
        content: [
          {
            endpoint: `${Endpoints.CandidateContact}{job_offer.candidate_contact.id}/`,
            type: 'link',
            field: 'job_offer.candidate_contact',
            action: 'showCandidateProfile'
          },
          {
            type: 'static',
            field: 'position'
          },
          {
            type: 'static',
            field: 'jobsite',
            description: ' '
          }
        ]
      },
      {
        content: [
          {
            values: {
              title: 'job_offer.candidate_contact.contact.__str__',
              picture: 'job_offer.candidate_contact.contact.picture.origin',
              position: 'position.__str__'
            },
            field: 'id',
            type: 'info',
            label: 'Personal Info'
          }
        ],
        name: 'personal_info',
        title: null,
        sort: true,
        sort_field: 'job_offer.candidate_contact',
        label: 'Candidate/Position',
        delim: null
      },
      {
        content: [
          {
            title: 'Show traking map',
            type: 'button',
            color: 'link',
            endpoint: `${Endpoints.CandidateLocation}{job_offer.candidate_contact.id}/history/`,
            field: 'id',
            action: 'showTracking',
            showIf: [{ status: [4, 5, 6, 7] }],
            customLink: true,
            image: '/assets/img/map-lg.jpg'
          },
        ],
        name: 'tracking',
        center: true,
        title: null,
        label: 'Tracking',
        delim: null
      },
      {
        label: 'Times',
        delim: null,
        sort: true,
        sort_field: 'shift_started_at',
        name: 'times',
        title: null,
        content: [
          {
            text: '{shift_started_at__date}',
            type: 'static',
            label: 'Shift date',
            field: 'shift_started_at'
          },
          {
            text: '{shift_started_at__time} - {shift_ended_at__time}',
            type: 'static',
            label: 'Shift start/end',
            field: 'shift_started_at'
          },
          {
            text: '{break_started_at__time} - {break_ended_at__time}',
            type: 'static',
            label: 'Break start/end',
            field: 'break_started_at'
          },
        ]
      },
      {
        label: 'Total time',
        delim: null,
        name: 'totalTime',
        content: [
          {
            type: 'static',
            color: 'success',
            text: '{totalTime}',
            setColor: 'shift_ended_at',
            field: 'totalTime',
          }
        ]
      },
      {
        label: 'Evaluate',
        delim: ' ',
        name: 'evaluate',
        title: null,
        content: [
          {
            label: 'Evaluate',
            text: 'Evaluate',
            type: 'button',
            svg: 'evaluate',
            color: 'warning',
            endpoint: `${Endpoints.Timesheet}{id}/evaluate/`,
            field: 'id',
            shadow: true,
            action: 'evaluateCandidate',
            hidden: 'evaluated'
          },
          {
            score: true,
            type: 'text',
            field: 'evaluation.evaluation_score',
            showIf: [
              {
                evaluated: true
              }
            ],
          }
        ]
      },
      {
        label: 'Approve/Change',
        delim: null,
        name: 'approve',
        hide: true,
        title: null,
        content: [
          {
            text: 'Approve',
            type: 'button',
            color: 'success',
            svg: 'approve',
            label: 'Approve',
            endpoint: '/hr/timesheets/{id}/approve/',
            replace_by: 'supervisor',
            field: 'id',
            shadow: true,
            action: 'approveTimesheet',
            hidden: 'supervisor_approved_at'
          }
        ]
      },
      {
        label: 'Change',
        delim: null,
        name: 'change',
        hide: true,
        title: null,
        content: [
          {
            text: 'Change',
            type: 'button',
            color: 'danger',
            svg: 'change',
            label: 'Change',
            endpoint: '/hr/timesheets/{id}/not_agree/',
            field: 'id',
            shadow: true,
            action: 'changeTimesheet',
            hidden: 'supervisor_approved_at'
          }
        ]
      },
      {
        label: 'Status',
        name: 'status',
        title: null,
        content: [
          {
            field: 'status',
            type: 'static',
            hideValue: true
          },
          {
            field: 'supervisor_approved',
            type: 'static',
            text: 'Approved',
            color: 'success',
            setColor: 'supervisor_approved',
            showIf: [{
              status: 7
            }]
          },
          {
            field: 'supervisor.name',
            type: 'static',
            showIf: [{
              status: 7
            }]
          },
          {
            text: '{supervisor_approved_at__datetime}',
            field: 'supervisor_approved_at',
            type: 'static',
            styles: ['muted'],
            showIf: [
              { status: 7 },
              'supervisor_approved_at',
              { supervisor_modified_at: null }
            ]
          },
          {
            field: 'supervisor_signature',
            type: 'picture',
            file: false,
            signature: true,
            showId: ['supervisor_signature.origin'],
            showIf: [{
              status: 7
            }]
          },
          {
            field: 'status',
            type: 'static',
            text: 'Waiting submission ',
            color: 'danger',
            setColor: 'status',
            showIf: [{
              status: 4
            }]
          },
          {
            field: 'status',
            type: 'static',
            text: 'Adjustment in progress',
            info: 'Timesheet will be automatically approved in 4 hours',
            color: 'primary',
            setColor: 'status',
            showIf: [{
              status: 6
            }]
          },
          {
            text: '{supervisor_modified_at__datetime}',
            field: 'supervisor_modified_at',
            type: 'static',
            styles: ['muted'],
            showIf: [{
              status: 6
            }, 'supervisor_modified_at']
          },
          {
            text: 'Change',
            type: 'button',
            color: 'danger',
            svg: 'change',
            label: 'Change',
            endpoint: '/hr/timesheets/{id}/not_agree/',
            field: 'id',
            shadow: true,
            action: 'changeTimesheet',
            showIf: [{
              status: 6
            }]
          },
          {
            text: 'Approve',
            type: 'button',
            color: 'success',
            svg: 'approve',
            label: 'Approve',
            endpoint: '/hr/timesheets/{id}/approve/',
            replace_by: 'supervisor',
            field: 'id',
            shadow: true,
            action: 'approveTimesheet',
            hidden: 'supervisor_approved_at',
            showIf: [{
              status: 5
            }]
          },
          {
            text: 'Change',
            type: 'button',
            color: 'danger',
            svg: 'change',
            label: 'Change',
            endpoint: '/hr/timesheets/{id}/not_agree/',
            field: 'id',
            shadow: true,
            action: 'changeTimesheet',
            showIf: [{
              status: 5
            }]
          },
        ]
      }
    ],
  },
  fields: []
};

export const history = {
  list,
  formset: list
};
