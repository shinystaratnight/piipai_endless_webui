import { Endpoints } from '@webui/data';

const form = [
  {
    values: {
      address: 'contact.address.__str__',
      title: 'contact.__str__',
      picture: 'contact.picture',
      birthday: 'contact.birthday'
    },
    type: 'info',
    key: 'id',
    hideOnMobile: true,
  },
  {
    type: 'tabs',
    hideEditButton: true,
    children: [
      {
        main: true,
        name: 'Personal Info',
        type: 'group',
        label: 'Personal information',
        children: [
          {
            type: 'row',
            showOnMobile: true,
            children: [
              {
                values: {
                  address: 'contact.address.__str__',
                  title: 'contact.__str__',
                  picture: 'contact.picture',
                  birthday: 'contact.birthday'
                },
                type: 'info',
                key: 'id',
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                label: 'Contacts',
                type: 'group',
                children: [
                  {
                    key: 'contact.id',
                    type: 'input',
                    hide: true,
                    templateOptions: {
                      required: false,
                      label: 'Id',
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    key: 'contact.birthday',
                    type: 'datepicker',
                    inline: true,
                    hide: true,
                    templateOptions: {
                      required: true,
                      label: 'Birthday',
                      type: 'date'
                    },
                    read_only: true
                  },
                  {
                    endpoint: Endpoints.Contact,
                    read_only: true,
                    key: 'contact',
                    hide: true,
                    templateOptions: {
                      label: 'Contact',
                      values: ['__str__'],
                      type: 'related',
                    },
                    type: 'related',
                    query: {
                      candidate: true
                    },
                  },
                  {
                    endpoint: Endpoints.Address,
                    read_only: true,
                    hide: true,
                    templateOptions: {
                      label: 'Address',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'address',
                      edit: false
                    },
                    collapsed: false,
                    send: false,
                    type: 'address',
                    key: 'contact.address',
                    many: false
                  },
                  {
                    key: 'contact.is_available',
                    read_only: false,
                    hide: true,
                    templateOptions: {
                      required: false,
                      label: 'Available',
                      type: 'checkbox'
                    },
                    send: false,
                    default: true,
                    type: 'checkbox'
                  },
                  {
                    key: 'contact.first_name',
                    type: 'input',
                    hide: true,
                    templateOptions: {
                      required: true,
                      label: 'First Name',
                      max: 255,
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    key: 'contact.last_name',
                    type: 'input',
                    hide: true,
                    templateOptions: {
                      required: true,
                      label: 'Last Name',
                      max: 255,
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    key: 'contact.email',
                    type: 'input',
                    templateOptions: {
                      placeholder: 'E-mail',
                      required: true,
                      label: 'E-mail',
                      max: 255,
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    key: 'contact.phone_mobile',
                    type: 'input',
                    templateOptions: {
                      placeholder: 'Mobile phone',
                      required: true,
                      label: 'Phone number',
                      type: 'text'
                    },
                    read_only: false
                  }
                ],
                width: 0.5
              },
              {
                label: 'Emergency contact',
                type: 'group',
                children: [
                  {
                    key: 'emergency_contact_name',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Name',
                      max: 63,
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    key: 'emergency_contact_phone',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Phone Number',
                      type: 'text'
                    },
                    read_only: false
                  },
                ],
                width: 0.5
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                label: 'Additional info',
                type: 'group',
                children: [
                  {
                    key: 'contact.gender',
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'Gender',
                      type: 'select',
                      options: [
                        {
                          value: 'male',
                          label: 'Male'
                        },
                        {
                          value: 'female',
                          label: 'Female'
                        }
                      ]
                    },
                    read_only: false
                  },
                  {
                    key: 'transportation_to_work',
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'Transportation',
                      type: 'select',
                      options: [
                        {
                          value: 1,
                          label: 'Own Car'
                        },
                        {
                          value: 2,
                          label: 'Public Transportation'
                        }
                      ]
                    },
                    read_only: false
                  }
                ],
                width: 0.25
              },
              {
                label: 'Phisical parameters',
                type: 'group',
                children: [
                  {
                    key: 'height',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Height, cm',
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    key: 'weight',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Weight, kg',
                      type: 'number'
                    },
                    read_only: false
                  },
                  {
                    key: 'bmi',
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Bmi',
                      type: 'static'
                    },
                    read_only: true
                  }
                ],
                width: 0.25
              },
              {
                label: 'Scores',
                type: 'group',
                children: [
                  {
                    key: 'candidate_scores.id',
                    read_only: false,
                    hide: true,
                    templateOptions: {
                      required: false,
                      label: 'Id',
                      type: 'text'
                    },
                    send: false,
                    type: 'input'
                  },
                  {
                    key: 'candidate_scores.reliability',
                    send: false,
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Reliability',
                      type: 'score',
                      danger: 'No rating'
                    },
                    read_only: true
                  },
                  {
                    key: 'candidate_scores.loyalty',
                    send: false,
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Loyalty',
                      type: 'score',
                      danger: 'No rating'
                    },
                    read_only: true
                  },
                ],
                width: 0.25
              },
              {
                label: 'Rating',
                type: 'group',
                children: [
                  {
                    key: 'candidate_scores.recruitment_score',
                    send: false,
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Average test',
                      type: 'score',
                      danger: 'No rating'
                    },
                    read_only: true
                  },
                  {
                    key: 'candidate_scores.client_feedback',
                    send: false,
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Client feedback',
                      type: 'score',
                      danger: 'No rating'
                    },
                    read_only: true
                  },
                  {
                    key: 'candidate_scores.skill_score',
                    send: false,
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Average skill',
                      type: 'score',
                      danger: 'No rating'
                    },
                    read_only: true
                  },
                ],
                width: 0.25
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                label: 'Residency',
                type: 'group',
                children: [
                  {
                    key: 'residency',
                    default: 0,
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'Residency Status',
                      type: 'select',
                      options: [
                        {
                          value: 0,
                          label: 'Unknown'
                        },
                        {
                          value: 1,
                          label: 'Citizen'
                        },
                        {
                          value: 2,
                          label: 'Permanent Resident'
                        },
                        {
                          value: 3,
                          label: 'Temporary Resident'
                        }
                      ]
                    },
                    read_only: false
                  },
                  // {
                  //   key: 'visa_type',
                  //   type: 'related',
                  //   endpoint: '/candidate/visatypes/',
                  //   showIf: [
                  //     {
                  //       residency: 3
                  //     }
                  //   ],
                  //   templateOptions: {
                  //     required: false,
                  //     label: 'Visa Type',
                  //     type: 'related'
                  //   },
                  //   read_only: false
                  // },
                  // {
                  //   key: 'visa_expiry_date',
                  //   type: 'datepicker',
                  //   showIf: [
                  //     {
                  //       residency: 3
                  //     }
                  //   ],
                  //   templateOptions: {
                  //     required: false,
                  //     label: 'Visa Expiry Date',
                  //     type: 'date'
                  //   },
                  //   read_only: false
                  // },
                ],
                width: 0.25
              },
              {
                type: 'group',
                label: ' ',
                children: [
                  {
                    endpoint: Endpoints.Country,
                    read_only: true,
                    templateOptions: {
                      label: 'Nationality',
                      values: ['__str__'],
                      type: 'related',
                    },
                    type: 'related',
                    key: 'nationality',
                  },
                  // {
                  //   key: 'vevo_checked_at',
                  //   type: 'datepicker',
                  //   showIf: [
                  //     {
                  //       residency: 3
                  //     }
                  //   ],
                  //   templateOptions: {
                  //     required: false,
                  //     label: 'VEVO checked at',
                  //     type: 'date'
                  //   },
                  //   read_only: false
                  // }
                ],
                width: 0.25
              }
            ]
          }
        ]
      },
      {
        endpoint: Endpoints.CandidateSkill,
        templateOptions: {
          label: 'Skills',
          type: 'list',
          add_label: '',
          text: 'Candidate skills'
        },
        collapsed: false,
        prefilled: {
          candidate_contact: '{id}'
        },
        metadata_query: {
          type: 'profile'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see skills'
      },
      {
        endpoint: Endpoints.CandidateTag,
        templateOptions: {
          label: 'Tags',
          type: 'list',
          add_label: '',
          text: 'Candidate tags'
        },
        visibleMode: true,
        prefilled: {
          candidate_contact: '{id}'
        },
        metadata_query: {
          type: 'profile'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see tags'
      },
      {
        endpoint: Endpoints.CandidateEvaluation,
        templateOptions: {
          label: 'Evaluations',
          text: 'Evaluations',
          add_label: '',
        },
        metadata_query: {
          type: 'profile'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see evaluations'
      },
    ]
  }
];

export const metadataProfile = {
  form
};
