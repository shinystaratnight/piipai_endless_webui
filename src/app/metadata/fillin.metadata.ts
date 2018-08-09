const list = {
  list: {
    pagination_label: 'Candidate Contact',
    list: 'candidatecontact',
    editDisable: false,
    label: 'Candidate Contact',
    highlight: {
      values: {
        1: 'lightgreen',
        2: '#dcdcdc',
        3: 'red',
        4: '#ff7f00',
        5: '#ff7f50'
      },
      field: 'color'
    },
    columns: [
      {
        name: 'contact.__str__',
        content: [
          {
            type: 'static',
            field: 'contact.__str__'
          }
        ],
        label: 'Contact'
      },
      {
        name: 'recruitment_agent',
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/',
            type: 'related',
            field: 'recruitment_agent'
          }
        ],
        sort: true,
        sort_field: 'recruitment_agent',
        label: 'Recruitment agent'
      },
      {
        name: 'available',
        content: [
          {
            type: 'static',
            field: 'available'
          }
        ],
        label: 'Available'
      },
      {
        name: 'days_from_last_timesheet',
        content: [
          {
            type: 'static',
            field: 'days_from_last_timesheet'
          }
        ],
        label: 'Days from last timesheet'
      },
      {
        title: null,
        content: [
          {
            endpoint: '/ecore/api/v2/distances/',
            field: 'distance_to_jobsite',
            async: true,
            type: 'static',
            request_field: 'distance',
            method: 'post',
            query: {
              candidates: '{id}',
              job: '{job.id}'
            }
          }
        ],
        delim: null,
        label: 'Distance to jobsite',
        name: 'distance_to_jobsite',
        sort: true,
        sort_field: 'distance_to_jobsite'
      },
      {
        title: null,
        content: [
          {
            endpoint: '/ecore/api/v2/distances/',
            field: 'time_to_jobsite',
            async: true,
            type: 'static',
            request_field: 'time',
            method: 'post',
            query: {
              candidates: '{id}'
            }
          }
        ],
        delim: null,
        label: 'Time to jobsite',
        name: 'time_to_jobsite',
        sort: true,
        sort_field: 'time_to_jobsite'
      },
      {
        name: 'skills_score',
        content: [
          {
            type: 'static',
            field: 'skills_score'
          }
        ],
        sort: true,
        sort_field: 'skills_score',
        label: 'Skills score'
      },
      {
        name: 'tag_rels',
        content: [
          {
            endpoint: '/ecore/api/v2/candidate/tagrels/',
            type: 'related',
            field: 'tag_rels'
          }
        ],
        sort: true,
        sort_field: 'tag_rels',
        label: 'Tag rels'
      },
      {
        name: 'count_timesheets',
        content: [
          {
            type: 'static',
            field: 'count_timesheets'
          }
        ],
        label: 'Count timesheets'
      },
      {
        name: 'contact.gender',
        content: [
          {
            type: 'select',
            values: {
              male: 'Male',
              female: 'Female'
            },
            field: 'contact.gender'
          }
        ],
        sort: true,
        sort_field: 'contact.gender',
        label: 'Gender'
      },
      {
        name: 'nationality',
        content: [
          {
            endpoint: '/ecore/api/v2/core/countries/',
            type: 'related',
            field: 'nationality'
          }
        ],
        sort: true,
        sort_field: 'nationality',
        label: 'Nationality'
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
            type: 'input',
            field: 'candidate_scores.reliability'
          }
        ],
        sort: true,
        sort_field: 'candidate_scores.reliability',
        label: 'Reliability'
      },
      {
        name: 'candidate_scores.average_score',
        content: [
          {
            type: 'input',
            field: 'candidate_scores.average_score'
          }
        ],
        sort: true,
        sort_field: 'candidate_scores__average_score',
        label: 'Average Score'
      },
      {
        name: 'strength',
        content: [
          {
            type: 'input',
            field: 'strength'
          }
        ],
        sort: true,
        sort_field: 'strength',
        label: 'Strength'
      },
      {
        name: 'language',
        content: [
          {
            type: 'input',
            field: 'language'
          }
        ],
        sort: true,
        sort_field: 'language',
        label: 'Language'
      },
      {
        name: 'hourly_rate',
        content: [
          {
            type: 'static',
            display: '${field}/h',
            field: 'hourly_rate'
          }
        ],
        title: null,
        delim: null,
        label: 'Hourly rate'
      },
      {
        name: 'evaluation',
        content: [
          {
            type: 'static',
            field: 'evaluation'
          }
        ],
        label: 'Evaluation'
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
        type: 'select',
        default: null,
        query: 'transportation_to_work'
      },
      {
        key: 'available',
        options: [
          {
            label: 'Partially',
            value: 'True'
          }
        ],
        label: 'Available',
        type: 'select',
        default: 'True',
        query: 'available'
      },
      {
        key: 'overpriced',
        options: [
          {
            label: 'Without overpriced',
            value: 'True'
          }
        ],
        label: 'Overpriced',
        type: 'select',
        default: 'False',
        query: 'overpriced'
      },
      {
        type: 'text',
        default: 50,
        label: 'Distance',
        min: 0,
        max: 200,
        key: 'distance_to_jobsite'
      },
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
        query: {
          shifts: '{id}'
        }
      },
      {
        key: 'show_without_tags',
        options: [
          {
            label: 'Only with job tags',
            value: 'False'
          }
        ],
        label: 'Tags',
        type: 'select',
        default: 'True',
        query: 'show_without_tags'
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
    }
  ]
};

export const metadata = {
  list
};
