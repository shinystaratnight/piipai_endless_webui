const list = {
  list: {
    list: 'skillrel',
    label: 'Candidate Skill',
    columns: [
      {
        content: [
          {
            endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
            field: 'candidate_contact',
            type: 'related'
          }
        ],
        name: 'candidate_contact',
        sort_field: 'candidate_contact',
        label: 'Candidate contact',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/skills/skills/',
            field: 'skill',
            type: 'related'
          }
        ],
        name: 'skill',
        sort_field: 'skill',
        label: 'Skill',
        sort: true
      },
      {
        content: [{ field: 'score', type: 'input' }],
        name: 'score',
        sort_field: 'score',
        label: 'Score',
        sort: true
      },
      {
        content: [
          {
            values: {
              '0': 'Inexperienced',
              '2592000': '1 Month',
              '7776000': '3 Months',
              '15552000': '6 Months',
              '31536000': '1 Year',
              '63072000': '2 Years',
              '94608000': '3 Years',
              '157680000': '5 Years or more'
            },
            field: 'prior_experience',
            type: 'select'
          }
        ],
        name: 'prior_experience',
        sort_field: 'prior_experience',
        label: 'Prior Experience',
        sort: true
      }
    ],
    pagination_label: 'Candidate Skill',
    search_enabled: false,
    editDisable: false,
    filters: [
      {
        key: 'candidate_contact',
        label: 'Candidate contact',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
          key: 'id'
        },
        query: 'candidate_contact'
      }
    ]
  },
  fields: [
    {
      list: false,
      endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
      read_only: true,
      templateOptions: {
        label: 'Candidate contact',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'candidate_contact',
      many: false
    },
    {
      key: 'score',
      default: 0,
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Score',
        type: 'number',
        min: 0,
        max: 32767
      },
      read_only: true
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/skills/skills/',
      read_only: true,
      templateOptions: {
        label: 'Skill',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'skill',
      many: false
    },
    {
      key: 'prior_experience',
      type: 'select',
      templateOptions: {
        required: false,
        label: 'Prior Experience',
        options: [
          { value: 0, label: 'Inexperienced' },
          { value: 2592000, label: '1 Month' },
          { value: 7776000, label: '3 Months' },
          { value: 15552000, label: '6 Months' },
          { value: 31536000, label: '1 Year' },
          { value: 63072000, label: '2 Years' },
          { value: 94608000, label: '3 Years' },
          { value: 157680000, label: '5 Years or more' }
        ],
        type: 'select'
      },
      read_only: true
    }
  ]
};

const form = [
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Candidate contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_contact',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: false,
    key: 'skill',
    templateOptions: {
      label: 'Skill',
      add: true,
      delete: false,
      values: ['default_rate', '__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    query: { exclude: '{candidate_contact.id}' },
    many: false
  },
  {
    key: 'score',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Score',
      max: 5,
      type: 'number',
      min: 0
    },
    read_only: false
  },
  {
    key: 'prior_experience',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Prior Experience',
      type: 'select',
      options: [
        { value: 0, label: 'Inexperienced' },
        { value: 2592000, label: '1 Month' },
        { value: 7776000, label: '3 Months' },
        { value: 15552000, label: '6 Months' },
        { value: 31536000, label: '1 Year' },
        { value: 63072000, label: '2 Years' },
        { value: 94608000, label: '3 Years' },
        { value: 157680000, label: '5 Years or more' }
      ]
    },
    read_only: false
  },
  {
    key: 'hourly_rate',
    default: '{skill.default_rate}',
    type: 'input',
    templateOptions: { required: true, label: 'Skill Rate', type: 'text' },
    read_only: false
  }
];

const formadd = [
  {
    list: false,
    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
    read_only: true,
    hide: true,
    templateOptions: {
      label: 'Candidate contact',
      add: true,
      delete: false,
      values: ['__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    key: 'candidate_contact',
    many: false
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/skills/skills/',
    read_only: false,
    key: 'skill',
    templateOptions: {
      label: 'Skill',
      add: true,
      delete: false,
      values: ['default_rate', '__str__'],
      type: 'related',
      edit: true
    },
    collapsed: false,
    type: 'related',
    query: { exclude: '{candidate_contact.id}' },
    many: false
  },
  {
    key: 'score',
    default: 0,
    type: 'input',
    templateOptions: {
      required: false,
      label: 'Score',
      max: 5,
      type: 'number',
      min: 0
    },
    read_only: false
  },
  {
    key: 'prior_experience',
    type: 'select',
    templateOptions: {
      required: false,
      label: 'Prior Experience',
      type: 'select',
      options: [
        { value: 0, label: 'Inexperienced' },
        { value: 2592000, label: '1 Month' },
        { value: 7776000, label: '3 Months' },
        { value: 15552000, label: '6 Months' },
        { value: 31536000, label: '1 Year' },
        { value: 63072000, label: '2 Years' },
        { value: 94608000, label: '3 Years' },
        { value: 157680000, label: '5 Years or more' }
      ]
    },
    read_only: false
  },
  {
    key: 'hourly_rate',
    default: '{skill.default_rate}',
    type: 'input',
    templateOptions: { required: true, label: 'Skill Rate', type: 'text' },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
