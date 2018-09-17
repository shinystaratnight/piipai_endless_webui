const list = {
  list: {
    pagination_label: 'Candidate Contact',
    list: 'fillin',
    editDisable: true,
    label: '{job.position}',
    description: '{job.jobsite}',
    openFilter: true,
    columns: [
      {
        name: 'favourite',
        content: [
          {
            type: 'icon',
            field: 'favourite',
            values: {
              false: 'star',
              true: 'star',
            },
          },
        ],
      },
      {
        name: 'contact.__str__',
        width: 175,
        content: [
          {
            type: 'static',
            field: 'contact.__str__'
          },
          {
            type: 'skills',
            field: 'candidate_scores.average_score'
          }
        ],
        label: 'Average score'
      },
      {
        name: 'hourly_rate',
        width: 90,
        content: [
          {
            type: 'static',
            display: '${field}/h',
            field: 'hourly_rate',
            color: 'danger',
            setColor: 'overpriced'
          },
          {
            type: 'description',
            field: 'overpriced',
            description: 'Candidate hourly rate is higher than job position default rate ${default_rate}',
            showIf: ['overpriced']
          }
        ],
        title: null,
        delim: ' ',
        label: 'Hourly rate'
      },
      {
        name: 'available',
        width: 160,
        content: [
          {
            type: 'available',
            field: 'available'
          }
        ],
        label: 'Available'
      },
      {
        name: 'timesheet',
        width: 150,
        content: [
          {
            type: 'static',
            field: 'count_timesheets',
            label: 'Total',
            display: '{field}',
          },
          {
            type: 'static',
            field: 'days_from_last_timesheet',
            label: 'From last',
            display: '{field} day(s)',
          }
        ],
        label: 'Timesheet'
      },
      {
        name: 'distance',
        width: 125,
        content: [
          {
            endpoint: '/ecore/api/v2/distances/',
            field: 'distance_to_jobsite',
            async: true,
            type: 'static',
            request_field: 'distance',
            method: 'post',
            label: 'Distance',
            display: '{field}km',
            query: {
              candidates: '{id}',
              job: '{job.id}'
            }
          },
          {
            endpoint: '/ecore/api/v2/distances/',
            field: 'time_to_jobsite',
            async: true,
            type: 'static',
            request_field: 'time',
            method: 'post',
            label: 'Time',
            query: {
              candidates: '{id}'
            }
          }
        ],
        label: 'Distance/time'
      },
      {
        name: 'skills_score',
        content: [
          {
            type: 'skills',
            field: 'skills_score'
          }
        ],
        sort: true,
        sort_field: 'skills_score',
        label: 'Skills score'
      },
      {
        name: 'tags',
        content: [
          {
            field: 'tags',
            type: 'fillintags'
          }
        ],
        label: 'Tags'
      },
      {
        title: null,
        content: [
          {
            type: 'select',
            values: {
              1: 'Own Car',
              2: 'Public Transportation'
            },
            field: 'transportation_to_work'
          }
        ],
        delim: null,
        label: 'Transportation to Work',
        name: 'transportation_to_work',
        sort: true,
        sort_field: 'transportation_to_work'
      },
      {
        name: 'candidate_scores.reliability',
        content: [
          {
            type: 'skills',
            field: 'candidate_scores.reliability'
          }
        ],
        sort: true,
        sort_field: 'candidate_scores.reliability',
        label: 'Reliability'
      },
      {
        name: 'candidate_scores.loyalty',
        content: [
          {
            type: 'skills',
            field: 'candidate_scores.loyalty'
          }
        ],
        label: 'Loyality'
      },
      {
        name: 'candidate_scores.recruitment_score',
        content: [
          {
            type: 'skills',
            field: 'candidate_scores.recruitment_score'
          }
        ],
        label: 'Recruitment'
      },
      {
        name: 'evaluation',
        content: [
          {
            type: 'skills',
            field: 'evaluation'
          }
        ],
        label: 'Evaluation'
      }
    ],
    tabs: [
      {
        label: 'Scores',
        is_collapsed: true,
        inline: true,
        fields: [
          'candidate_scores.recruitment_score',
          'evaluation',
          'skills_score',
          'candidate_scores.reliability',
          'candidate_scores.loyalty'
        ]
      },
      {
        label: 'Tags',
        is_collapsed: true,
        inline: true,
        fields: ['tags']
      }
    ],
    buttons: [
      {
        action: 'openMap',
        label: 'Show map'
      }
    ],
    search_enabled: true,
    filters: [
      {
        unique: ['date'],
        label: 'Shifts',
        type: 'multiple',
        display: '__str__',
        preset: true,
        data: {
          data: 'shifts'
        },
        key: 'date',
        param: '{id}',
        query: 'shifts'
      },
      {
        key: 'available',
        label: 'Available',
        options: [
          {
            label: 'Show partialy available',
            value: 'True'
          }
        ],
        query: 'available',
        default: 'True',
        type: 'checkbox'
      },
      {
        key: 'show_without_tags',
        options: [
          {
            label: 'Only job tags',
            value: 'False'
          }
        ],
        label: 'Tags',
        type: 'checkbox',
        query: 'show_without_tags'
      },
      {
        key: 'overpriced',
        options: [
          {
            label: 'Show overpriced',
            value: 'True'
          }
        ],
        label: 'Overpriced',
        type: 'checkbox',
        default: 'True',
        query: 'overpriced'
      },
      {
        key: 'transportation_to_work',
        options: [
          {
            label: 'Own Car',
            value: 1
          },
          {
            label: 'Public Transportation',
            value: 2
          }
        ],
        label: 'Transportation to Work',
        type: 'checkbox',
        multiple: false,
        default: null,
        query: 'transportation_to_work'
      },
      {
        type: 'text',
        default: null,
        label: 'Distance',
        min: 0,
        max: 200,
        key: 'distance_to_jobsite',
        query: 'distance_to_jobsite'
      }
    ]
  },
  fields: [
    {
      templateOptions: {
        label: 'Time to jobsite',
        type: 'static',
        required: false
      },
      type: 'static',
      key: 'time_to_jobsite',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Transportation to Work',
        type: 'select',
        required: false,
        options: [
          {
            label: 'Own Car',
            value: 1
          },
          {
            label: 'Public Transportation',
            value: 2
          }
        ]
      },
      type: 'select',
      key: 'transportation_to_work',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Days from last timesheet',
        type: 'static',
        required: false
      },
      type: 'static',
      key: 'days_from_last_timesheet',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Distance to jobsite',
        type: 'static',
        required: false
      },
      type: 'static',
      key: 'distance_to_jobsite',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Evaluation',
        type: 'static',
        required: false
      },
      type: 'static',
      key: 'evaluation',
      read_only: true
    },
    {
      templateOptions: {
        required: false,
        options: [
          {
            label: 'Male',
            value: 'male'
          },
          {
            label: 'Female',
            value: 'female'
          }
        ],
        label: 'Gender',
        type: 'select'
      },
      type: 'select',
      key: 'contact.gender',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Available',
        type: 'static',
        required: false
      },
      type: 'static',
      key: 'available',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Hourly rate',
        type: 'static',
        display: '${field}/h',
        required: false
      },
      type: 'static',
      key: 'hourly_rate',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Skills score',
        type: 'static',
        required: false
      },
      type: 'static',
      key: 'skills_score',
      read_only: true
    },
    {
      templateOptions: {
        type: 'number',
        required: false,
        label: 'Strength',
        min: 0,
        max: 32767
      },
      type: 'input',
      default: 0,
      key: 'strength',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Contact',
        type: 'static',
        required: false
      },
      type: 'static',
      key: 'contact.__str__',
      read_only: true
    },
    {
      templateOptions: {
        edit: true,
        label: 'Tag rels',
        add: true,
        delete: false,
        type: 'related',
        values: ['__str__']
      },
      endpoint: '/ecore/api/v2/candidate/tagrels/',
      list: false,
      collapsed: false,
      type: 'related',
      many: true,
      key: 'tag_rels',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Count timesheets',
        type: 'static',
        required: false
      },
      type: 'static',
      key: 'count_timesheets',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Average Score',
        type: 'number',
        required: false
      },
      type: 'input',
      key: 'candidate_scores.average_score',
      read_only: true
    },
    {
      templateOptions: {
        type: 'number',
        required: false,
        label: 'Language',
        min: 0,
        max: 32767
      },
      type: 'input',
      default: 0,
      key: 'language',
      read_only: true
    },
    {
      templateOptions: {
        label: 'Reliability',
        type: 'number',
        required: false
      },
      type: 'input',
      key: 'candidate_scores.reliability',
      read_only: true
    },
    {
      templateOptions: {
        edit: true,
        label: 'Recruitment agent',
        add: true,
        delete: false,
        type: 'related',
        values: ['__str__']
      },
      endpoint: '/ecore/api/v2/core/companycontacts/',
      list: false,
      collapsed: false,
      type: 'related',
      many: false,
      key: 'recruitment_agent',
      read_only: true
    },
    {
      templateOptions: {
        edit: true,
        label: 'Nationality',
        add: true,
        delete: false,
        type: 'related',
        values: ['__str__']
      },
      endpoint: '/ecore/api/v2/core/countries/',
      list: false,
      collapsed: false,
      type: 'related',
      many: false,
      key: 'nationality',
      read_only: true
    },
    {
      key: 'favourite',
      templateOptions: {
        color: {
          true: 'warning',
          false: 'opacity'
        }
      }
    }
  ]
};

export const metadata = {
  list
};
