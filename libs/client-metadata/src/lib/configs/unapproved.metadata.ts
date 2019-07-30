const list = {
  list: {
    list: 'timesheet',
    search_enabled: false,
    pagination_label: 'Unapproved timesheets',
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
            endpoint:
              '/candidate/candidatecontacts/{job_offer.candidate_contact.id}/',
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
        sort: true,
        sort_field: 'job_offer.candidate_contact',
        title: null,
        label: 'Candidate/Position',
        delim: null
      },
      {
        content: [
          {
            title: 'Show traking map',
            type: 'button',
            color: 'link',
            endpoint: '/candidate/location/{job_offer.candidate_contact.id}/history/',
            field: 'id',
            action: 'showTracking',
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
            svg: 'evaluate',
            type: 'button',
            color: 'warning',
            endpoint: '/hr/timesheets/{id}/evaluate/',
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
        label: 'Tracking',
        delim: null,
        hide: true,
        name: 'traking',
        title: null,
        content: [
          {
            label: 'Traking',
            text: 'Show',
            icon: 'fa-map-marker-alt',
            type: 'button',
            color: 'primary',
            endpoint: '/candidate/location/{job_offer.candidate_contact.id}/history/',
            field: 'id',
            action: 'showTracking'
          }
        ]
      }
    ],
    editDisable: true,
    label: 'Unapproved timesheets'
  },
  fields: []
};

export const unapproved = {
  list,
  formset: list
};
