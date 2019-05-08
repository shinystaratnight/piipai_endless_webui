const list = {
  list: {
    list: 'timesheet',
    search_enabled: false,
    pagination_label: 'Approved timesheets',
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
          { type: 'static', label: 'Position', field: 'position' }
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
            text: '{shift_started_at__time}',
            type: 'static',
            label: 'Shift started at',
            field: 'shift_started_at'
          },
          {
            text: '{break_started_at__time} - {break_ended_at__time}',
            type: 'static',
            label: 'Break',
            field: 'break_started_at'
          },
          {
            text: '{shift_ended_at__time}',
            type: 'static',
            label: 'Shift ended at',
            field: 'shift_ended_at'
          }
        ]
      },
      {
        label: 'Total hours',
        delim: null,
        name: 'totalTime',
        content: [
          {
            type: 'static',
            color: 'primary',
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
            endpoint: '/hr/timesheets/{id}/evaluate/',
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
    editDisable: true,
    label: 'Approved timesheets'
  },
  fields: [
    {
      key: 'id',
      type: 'button',
      templateOptions: {
        text: 'Evaluate',
        label: 'Evaluate',
        action: 'evaluateCandidate',
        type: 'button'
      },
      read_only: true
    },
    {
      key: 'job_offer.candidate_contact.contact.picture',
      default: 'contact_pictures/default_picture.jpg',
      type: 'input',
      templateOptions: {
        max: 255,
        required: false,
        file: false,
        type: 'picture',
        label: 'Picture'
      },
      read_only: true
    },
    {
      key: 'position',
      type: 'static',
      templateOptions: { type: 'static', required: false, label: 'Position' },
      read_only: true
    },
    {
      key: 'job_offer.candidate_contact',
      type: 'link',
      templateOptions: { link: null, text: '', label: '', type: 'link' },
      read_only: true
    },
    {
      key: 'shift_ended_at',
      default: '2018-07-05T15:30:00+10:00',
      type: 'static',
      templateOptions: {
        text: '{shift_ended_at__time}',
        required: false,
        type: 'static',
        label: 'Shift ended at'
      },
      read_only: true
    },
    {
      key: 'supervisor_approved_at',
      default: '2018-07-05T15:30:00+10:00',
      type: 'static',
      templateOptions: {
        text: '{supervisor_approved_at__datetime}',
        required: false,
        type: 'static',
        label: 'Shift ended at'
      },
      read_only: true
    },
    {
      key: 'shift_started_at',
      type: 'static',
      templateOptions: {
        text: '{shift_started_at__date}',
        required: false,
        type: 'static',
        label: 'Shift date'
      },
      read_only: true
    },
    {
      key: 'break_started_at',
      default: '2018-07-05T12:00:00+10:00',
      type: 'static',
      templateOptions: {
        text: '{break_started_at__time} - {break_ended_at__time}',
        required: false,
        type: 'static',
        label: 'Break'
      },
      read_only: true
    }
  ]
};

export const metadata = {
  list,
  formset: list
};
