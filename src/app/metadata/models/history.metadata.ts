import { Endpoints } from '../helpers';

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
            showIf: [{ status: 4 }],
            customLink: true,
            image: '/assets/img/map-lg.png'
          },
          {
            title: 'Show traking map',
            type: 'button',
            color: 'link',
            endpoint: `${Endpoints.CandidateLocation}{job_offer.candidate_contact.id}/history/`,
            field: 'id',
            action: 'showTracking',
            showIf: [{ status: 5 }],
            customLink: true,
            image: '/assets/img/map-lg.png'
          },
          {
            title: 'Show traking map',
            type: 'button',
            color: 'link',
            endpoint: `${Endpoints.CandidateLocation}{job_offer.candidate_contact.id}/history/`,
            field: 'id',
            action: 'showTracking',
            showIf: [{ status: 6 }],
            customLink: true,
            image: '/assets/img/map-lg.png'
          },
          {
            title: 'Show traking map',
            type: 'button',
            color: 'link',
            endpoint: `${Endpoints.CandidateLocation}{job_offer.candidate_contact.id}/history/`,
            field: 'id',
            action: 'showTracking',
            showIf: [{ status: 7 }],
            customLink: true,
            image: '/assets/img/map-lg.png'
          }
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
            field: 'evaluation.level_of_communication',
            showIf: [
              {
                evaluated: true
              }
            ],
          }
        ]
      },
      {
        label: 'Status',
        name: 'status',
        title: null,
        content: [
          {
            field: 'supervisor_approved',
            type: 'static',
            text: 'Approved',
            color: 'success',
            setColor: 'supervisor_approved',
          },
          {
            field: 'supervisor.name',
            type: 'static',
          },
          {
            text: '{supervisor_approved_at__datetime}',
            field: 'supervisor_approved_at',
            type: 'static',
            muted: true
          },
          {
            field: 'supervisor_signature',
            type: 'picture',
            file: false,
            signature: true,
            showId: ['supervisor_signature.origin']
          }
        ]
      }
    ],
  },
  fields: []
};

export const metadata = {
  list,
  formset: list
};
