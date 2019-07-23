const form = [
  {
    type: 'row',
    children: [
      {
        type: 'column',
        children: [
          {
            type: 'row',
            children: [
              {
                type: 'input',
                templateOptions: {
                  type: 'text',
                  label: 'Picture',
                  max: 255,
                  required: false
                },
                read_only: false,
                default: 'contact_pictures/default_picture.jpg',
                key: 'contact.picture'
              }
            ]
          },
          {
            type: 'collapse',
            children: [
              {
                type: 'select',
                templateOptions: {
                  type: 'select',
                  options: [
                    { label: 'Unknown', value: 0 },
                    { label: 'Citizen', value: 1 },
                    { label: 'Permanent Resident', value: 2 },
                    { label: 'Temporary Resident', value: 3 }
                  ],
                  label: 'Residency Status',
                  required: false
                },
                read_only: false,
                default: 0,
                key: 'residency'
              },
              {
                type: 'related',
                templateOptions: {
                  type: 'related',
                  values: ['__str__'],
                  edit: true,
                  add: true,
                  delete: false,
                  label: 'Visa type'
                },
                read_only: false,
                many: false,
                key: 'visa_type',
                list: false,
                endpoint: '/candidate/visatypes/',
                collapsed: false
              },
              {
                type: 'datepicker',
                templateOptions: {
                  type: 'date',
                  label: 'Visa Expiry Date',
                  required: false
                },
                read_only: false,
                key: 'visa_expiry_date'
              },
              {
                type: 'related',
                templateOptions: {
                  type: 'related',
                  values: ['__str__'],
                  edit: true,
                  add: true,
                  delete: false,
                  label: 'Nationality'
                },
                read_only: false,
                many: false,
                key: 'nationality',
                list: false,
                endpoint: '/core/countries/',
                collapsed: false
              }
            ],
            label: 'Residency'
          }
        ]
      },
      {
        type: 'column',
        children: [
          {
            type: 'collapse',
            children: [
              {
                type: 'select',
                templateOptions: {
                  type: 'select',
                  options: [
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' }
                  ],
                  label: 'Gender',
                  required: false
                },
                read_only: false,
                key: 'contact.gender'
              },
              {
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Weight, kg',
                  required: false
                },
                read_only: false,
                key: 'weight'
              },
              {
                type: 'select',
                templateOptions: {
                  type: 'select',
                  options: [
                    { label: 'Own Car', value: 1 },
                    { label: 'Public Transportation', value: 2 }
                  ],
                  label: 'Transportation to Work',
                  required: false
                },
                read_only: false,
                key: 'transportation_to_work'
              },
              {
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Strength',
                  max: 32767,
                  min: 0,
                  required: false
                },
                read_only: false,
                default: 0,
                key: 'strength'
              },
              {
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Language',
                  max: 32767,
                  min: 0,
                  required: false
                },
                read_only: false,
                default: 0,
                key: 'language'
              },
              {
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Reliability',
                  required: false
                },
                read_only: false,
                key: 'candidate_scores.reliability'
              },
              {
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Loyalty',
                  required: false
                },
                read_only: false,
                key: 'candidate_scores.loyalty'
              },
              {
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Recruitment Score',
                  required: false
                },
                read_only: false,
                key: 'candidate_scores.recruitment_score'
              },
              {
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: 'Client Feedback',
                  required: false
                },
                read_only: false,
                key: 'candidate_scores.client_feedback'
              }
            ],
            label: 'Personal Traits'
          }
        ]
      }
    ]
  },
  {
    type: 'related',
    templateOptions: {
      type: 'related',
      values: ['__str__'],
      edit: false,
      add: true,
      delete: false,
      label: 'Skills'
    },
    read_only: false,
    many: true,
    key: 'candidate_skills',
    list: true,
    endpoint: '/candidate/skillrels/',
    collapsed: true
  },
  {
    type: 'related',
    templateOptions: {
      type: 'related',
      values: ['__str__'],
      edit: false,
      add: true,
      delete: false,
      label: 'Tags'
    },
    read_only: false,
    many: true,
    key: 'tag_rels',
    list: true,
    endpoint: '/candidate/tagrels/',
    collapsed: true
  },
  {
    type: 'collapse',
    children: [
      {
        type: 'input',
        templateOptions: {
          type: 'email',
          label: 'E-mail',
          max: 255,
          required: true
        },
        read_only: false,
        key: 'contact.email'
      },
      {
        type: 'input',
        templateOptions: {
          type: 'text',
          label: 'Mobile Phone',
          required: true
        },
        read_only: false,
        key: 'contact.phone_mobile'
      },
      {
        type: 'input',
        templateOptions: {
          type: 'text',
          label: 'Street Address',
          max: 126,
          required: true
        },
        read_only: false,
        key: 'contact.address.street_address'
      },
      {
        type: 'input',
        templateOptions: {
          type: 'text',
          label: 'Postal Code',
          max: 11,
          required: false
        },
        read_only: false,
        key: 'contact.address.postal_code'
      },
      {
        type: 'related',
        templateOptions: {
          type: 'related',
          values: ['__str__'],
          edit: true,
          add: true,
          delete: false,
          label: 'City'
        },
        read_only: true,
        many: false,
        key: 'contact.address.city',
        list: false,
        endpoint: '/core/cities/',
        collapsed: false
      },
      {
        type: 'related',
        templateOptions: {
          type: 'related',
          values: ['__str__'],
          edit: true,
          add: true,
          delete: false,
          label: 'State'
        },
        read_only: true,
        many: false,
        key: 'contact.address.state',
        list: false,
        endpoint: '/core/regions/',
        collapsed: false
      },
      {
        type: 'related',
        templateOptions: {
          type: 'related',
          values: ['__str__'],
          edit: true,
          add: true,
          delete: false,
          label: 'Country'
        },
        read_only: true,
        many: false,
        key: 'contact.address.country',
        list: false,
        endpoint: '/core/countries/',
        default: 'AU',
        collapsed: false
      }
    ],
    label: 'Contact Details'
  }
];

export const metadata = {
  form
};
