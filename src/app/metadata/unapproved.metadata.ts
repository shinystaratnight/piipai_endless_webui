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
        name: 'job_offer.candidate_contact.contact.picture',
        sort: true,
        sort_field: 'job_offer.candidate_contact.contact.picture',
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
        label: 'Times',
        delim: null,
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
            type: 'text',
            field: 'totalTime',
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
            icon: 'fa-check',
            type: 'button',
            color: 'success',
            label: 'Approve',
            endpoint: '/hr/timesheets/{id}/approve/',
            replace_by: 'supervisor',
            field: 'id',
            action: 'approveTimesheet',
            hidden: 'supervisor_approved_at'
          },
          {
            text: 'Change',
            icon: 'fa-pencil',
            type: 'button',
            color: 'danger',
            label: 'Change',
            endpoint: '/hr/timesheets/{id}/not_agree/',
            field: 'id',
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
            icon: 'fa-pencil',
            type: 'button',
            color: 'danger',
            label: 'Change',
            endpoint: '/hr/timesheets/{id}/not_agree/',
            field: 'id',
            action: 'changeTimesheet',
            hidden: 'supervisor_approved_at'
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
            icon: 'fa-star',
            type: 'button',
            color: 'warning',
            endpoint: '/hr/timesheets/{id}/evaluate/',
            field: 'id',
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
        label: 'Tracking',
        delim: null,
        name: 'traking',
        title: null,
        content: [
          {
            label: 'Traking',
            text: 'Show',
            icon: 'fa-map-marker',
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
  fields: [
    {
      key: 'id',
      type: 'button',
      templateOptions: {
        text: 'Approve',
        label: 'Approve',
        action: 'approveTimesheet',
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
