const list = {
  list: {
    list: 'candidatecontact',
    label: 'Candidate Contact',
    pagination_label: 'Candidate Contact',
    columns: [
      {
        content: [
          {
            values: {
              available: 'contact.is_available',
              address: 'contact.address.__str__',
              title: 'contact.__str__',
              status: {
                field: 'latest_state',
                color: {
                  danger: [0, 80, 90]
                },
                color_attr: 'number'
              },
              picture: 'contact.picture.origin'
            },
            field: 'id',
            type: 'info',
            label: 'Personal Info'
          }
        ],
        name: 'personal_info',
        title: null,
        label: 'Personal Info',
        delim: null
      },
      {
        content: [
          {
            field: 'contact.email',
            type: 'link',
            label: 'E-mail',
            link: 'mailto:{contact.email}'
          },
          {
            field: 'contact.phone_mobile',
            type: 'link',
            link: 'tel:{contact.phone_mobile}'
          }
        ],
        name: 'contacts',
        title: null,
        label: 'Contacts',
        delim: null
      },
      {
        content: [
          {
            field: 'skill_list',
            type: 'skills',
            label: 'Skills'
          }
        ],
        name: 'skills',
        title: null,
        label: 'Skills',
        delim: null
      },
      {
        delim: null,
        label: 'Tag list',
        sort: true,
        content: [
          {
            field: 'tag_list',
            type: 'tags'
          }
        ],
        name: 'tag_list',
        title: null,
        sort_field: 'tag_list'
      },
      {
        delim: null,
        label: 'Reliability',
        sort: true,
        content: [
          {
            field: 'candidate_scores.reliability',
            type: 'skills'
          }
        ],
        name: 'candidate_scores.reliability',
        title: null,
        sort_field: 'candidate_scores.reliability'
      },
      {
        delim: null,
        label: 'Loyalty',
        sort: true,
        content: [
          {
            field: 'candidate_scores.loyalty',
            type: 'skills'
          }
        ],
        name: 'candidate_scores.loyalty',
        title: null,
        sort_field: 'candidate_scores.loyalty'
      },
      {
        delim: null,
        label: 'Strength',
        sort: true,
        content: [
          {
            field: 'strength',
            type: 'skills'
          }
        ],
        name: 'strength',
        title: null,
        sort_field: 'strength'
      },
      {
        content: [
          {
            values: {
              male: 'Male',
              female: 'Female'
            },
            field: 'contact.gender',
            type: 'select'
          }
        ],
        name: 'contact.gender',
        sort_field: 'contact.gender',
        label: 'Gender',
        sort: true
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/countries/',
            field: 'nationality',
            type: 'related'
          }
        ],
        name: 'nationality',
        sort_field: 'nationality',
        label: 'Nationality',
        sort: true
      },
      {
        content: [
          {
            field: 'weight',
            type: 'input'
          }
        ],
        name: 'weight',
        sort_field: 'weight',
        label: 'Weight, kg',
        sort: true
      },
      {
        content: [
          {
            field: 'height',
            type: 'input'
          }
        ],
        name: 'height',
        sort_field: 'height',
        label: 'Height, cm',
        sort: true
      },
      {
        content: [
          {
            values: {
              1: 'Own Car',
              2: 'Public Transportation'
            },
            field: 'transportation_to_work',
            type: 'select'
          }
        ],
        name: 'transportation_to_work',
        sort_field: 'transportation_to_work',
        label: 'Transportation to Work',
        sort: true
      },
      {
        content: [
          {
            field: 'bmi',
            type: 'static'
          }
        ],
        name: 'bmi',
        label: 'Bmi'
      },
      {
        content: [
          {
            field: 'language',
            type: 'input'
          }
        ],
        name: 'language',
        sort_field: 'language',
        label: 'Language',
        sort: true
      }
    ],
    tabs: [
      {
        label: 'Additional Info',
        is_collapsed: true,
        fields: [
          'nationality',
          'contact.gender',
          'language',
          'transportation_to_work'
        ]
      },
      {
        label: 'Phisical Parameters',
        is_collapsed: true,
        fields: ['height', 'weight', 'bmi']
      },
      {
        label: 'Character',
        is_collapsed: true,
        fields: [
          'candidate_scores.reliability',
          'candidate_scores.loyalty',
          'strength'
        ]
      },
      {
        label: 'Tags',
        is_collapsed: true,
        fields: ['tag_list']
      }
    ],
    filters: [
      {
        key: 'skill',
        label: 'Skills',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/skills/skills/',
          key: 'id'
        },
        query: 'skill',
        multiple: true,
        type: 'related'
      },
      {
        key: 'tag',
        label: 'Tags',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/tags/',
          key: 'id'
        },
        query: 'tag',
        multiple: true,
        type: 'related'
      },
      {
        key: 'status',
        label: 'Status',
        data: {
          value: ['name_after_activation', 'name_before_activation'],
          endpoint: '/ecore/api/v2/core/workflownodes/?company={company_settings.company}&content_type=candidate.candidatecontact',
          key: 'number'
        },
        query: 'status',
        default: null,
        type: 'related'
      },
      {
        key: 'contact.gender',
        label: 'Gender',
        options: [
          {
            value: 'male',
            label: 'Male'
          },
          {
            value: 'female',
            label: 'Female'
          }
        ],
        query: 'contact__gender',
        multiple: true,
        default: null,
        type: 'checkbox'
      },
      {
        key: 'recruitment_agent',
        label: 'Recruitment agent',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companycontacts/',
          key: 'id'
        },
        query: 'recruitment_agent'
      },
      {
        key: 'candidate_scores.average_score',
        label: 'Overal score',
        max: 5,
        input: [
          {
            label: 'From',
            query: 'candidate_scores__average_score_0'
          },
          {
            label: 'To',
            query: 'candidate_scores__average_score_1'
          }
        ],
        default: null,
        type: 'range',
        min: null
      },
      {
        key: 'transportation_to_work',
        label: 'Transportation to Work',
        options: [
          {
            value: 1,
            label: 'Own Car'
          },
          {
            value: 2,
            label: 'Public Transportation'
          }
        ],
        query: 'transportation_to_work',
        multiple: true,
        default: null,
        type: 'checkbox'
      },
      {
        list: [
          {
            label: 'Yesterday',
            query: 'created_at_0=2018-07-03&created_at_1=2018-07-03'
          },
          {
            label: 'Today',
            query: 'created_at_0=2018-07-04&created_at_1=2018-07-04'
          }
        ],
        key: 'created_at',
        label: 'Created at',
        type: 'date',
        input: [
          {
            label: 'From date',
            query: 'created_at_0'
          },
          {
            label: 'To date',
            query: 'created_at_1'
          }
        ]
      }
    ],
    search_enabled: true,
    editDisable: false,
    actions: {
      options: [
        {
          endpoint: '/ecore/api/v2/candidate/candidatecontacts/sendsms/',
          label: 'Send sms',
          confirm: false,
          message: 'Are you sure?'
        }
      ],
      label: 'Actions',
      agree_label: 'Agree',
      button_label: 'Go',
      decline_label: 'Decline'
    }
  },
  fields: [
    {
      key: 'weight',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Weight, kg',
        type: 'number'
      },
      read_only: true
    },
    {
      key: 'strength',
      default: 0,
      type: 'skills',
      templateOptions: {
        required: false,
        label: 'Strength',
        max: 32767,
        type: 'skills',
        min: 0
      },
      read_only: true
    },
    {
      key: 'candidate_scores.reliability',
      type: 'skills',
      templateOptions: {
        required: false,
        label: 'Reliability',
        type: 'skills'
      },
      read_only: true
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
    },
    {
      read_only: true,
      values: {
        available: 'contact.is_available',
        address: 'contact.address.__str__',
        title: 'contact.__str__',
        status: {
          field: 'latest_state',
          color: {
            danger: [0, 80, 90]
          },
          color_attr: 'number'
        },
        picture: 'contact.picture.origin'
      },
      type: 'info',
      key: 'id'
    },
    {
      key: 'tag_list',
      type: 'tags',
      templateOptions: {
        required: false,
        label: 'Tag list',
        type: 'tags'
      },
      read_only: true
    },
    {
      key: 'height',
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Height, cm',
        type: 'number'
      },
      read_only: true
    },
    {
      key: 'transportation_to_work',
      type: 'select',
      templateOptions: {
        required: false,
        label: 'Transportation to Work',
        options: [
          {
            value: 1,
            label: 'Own Car'
          },
          {
            value: 2,
            label: 'Public Transportation'
          }
        ],
        type: 'select'
      },
      read_only: true
    },
    {
      key: 'contact.gender',
      type: 'select',
      templateOptions: {
        required: false,
        label: 'Gender',
        options: [
          {
            value: 'male',
            label: 'Male'
          },
          {
            value: 'female',
            label: 'Female'
          }
        ],
        type: 'select'
      },
      read_only: true
    },
    {
      key: 'contact.phone_mobile',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: 'tel:{field}',
        text: ''
      },
      read_only: true
    },
    {
      key: 'language',
      default: 0,
      type: 'input',
      templateOptions: {
        required: false,
        label: 'Language',
        type: 'number',
        min: 0,
        max: 32767
      },
      read_only: true
    },
    {
      key: 'contact.email',
      type: 'link',
      templateOptions: {
        label: 'E-mail',
        type: 'link',
        link: 'mailto:{field}',
        text: 'E-mail'
      },
      read_only: true
    },
    {
      key: 'candidate_scores.loyalty',
      type: 'skills',
      templateOptions: {
        required: false,
        label: 'Loyalty',
        type: 'skills'
      },
      read_only: true
    },
    {
      key: 'skill_list',
      type: 'skills',
      templateOptions: {
        required: false,
        label: 'Skills',
        type: 'skills'
      },
      read_only: true
    },
    {
      list: false,
      endpoint: '/ecore/api/v2/core/countries/',
      read_only: true,
      templateOptions: {
        label: 'Nationality',
        add: true,
        delete: false,
        values: ['__str__'],
        type: 'related',
        edit: true
      },
      collapsed: false,
      type: 'related',
      key: 'nationality',
      many: false
    }
  ]
};

const form = [
  {
    values: {
      created_at: 'created_at',
      status: {
        field: 'active_states',
        color: {
          danger: [0, 80, 90],
          color_attr: 'number'
        }
      },
      available: 'contact.is_available',
      address: 'contact.address.__str__',
      title: 'contact.__str__',
      updated_at: 'updated_at',
      picture: 'contact.picture'
    },
    type: 'info',
    key: 'id'
  },
  {
    type: 'tabs',
    children: [
      {
        main: true,
        name: 'Personal Info',
        type: 'group',
        label: 'Personal information',
        children: [
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
                    list: false,
                    endpoint: '/ecore/api/v2/core/contacts/',
                    read_only: true,
                    key: 'contact',
                    hide: true,
                    templateOptions: {
                      label: 'Contact',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    query: {
                      candidate: true
                    },
                    many: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/addresses/',
                    read_only: true,
                    hide: true,
                    templateOptions: {
                      label: 'Address',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'address',
                      edit: true
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
                      label: '',
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
                      label: '',
                      type: 'text'
                    },
                    read_only: false
                  }
                ],
                width: 0.5
              },
              {
                label: 'Notify',
                type: 'group',
                children: [
                  {
                    key: 'message_by_email',
                    default: false,
                    type: 'checkbox',
                    templateOptions: {
                      required: false,
                      label: 'E-Mail',
                      type: 'checkbox'
                    },
                    read_only: false
                  },
                  {
                    key: 'message_by_sms',
                    default: false,
                    type: 'checkbox',
                    templateOptions: {
                      required: false,
                      label: 'SMS',
                      type: 'checkbox'
                    },
                    read_only: false
                  }
                ],
                width: 0.25
              },
              {
                label: 'Recruitment agent',
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/companycontacts/',
                    read_only: false,
                    key: 'recruitment_agent',
                    templateOptions: {
                      label: '',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    default: 'session.contact.contact_id',
                    type: 'related',
                    query: {
                      master_company: 'current'
                    },
                    many: false
                  },
                  {
                    key: 'recruitment_agent.contact.phone_mobile',
                    send: false,
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: '',
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    key: 'recruitment_agent.contact',
                    read_only: false,
                    hide: true,
                    templateOptions: {
                      required: true,
                      label: '',
                      type: 'text'
                    },
                    send: false,
                    type: 'input'
                  }
                ],
                width: 0.25
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
                    key: 'language',
                    default: 0,
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Language',
                      max: 5,
                      type: 'score',
                      min: 0
                    },
                    read_only: false
                  },
                  {
                    key: 'transportation_to_work',
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'Transportation to Work',
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
                label: 'Character',
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
                      type: 'score'
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
                      type: 'score'
                    },
                    read_only: true
                  },
                  {
                    key: 'strength',
                    default: 0,
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Strength',
                      max: 5,
                      type: 'score',
                      min: 0
                    },
                    read_only: false
                  }
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
                      label: 'Recruitment Score',
                      type: 'score'
                    },
                    read_only: true
                  },
                  {
                    key: 'candidate_scores.client_feedback',
                    send: false,
                    type: 'static',
                    templateOptions: {
                      required: false,
                      label: 'Client Score',
                      type: 'score'
                    },
                    read_only: true
                  }
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
                  {
                    key: 'visa_expiry_date',
                    type: 'datepicker',
                    showIf: [
                      {
                        residency: 3
                      }
                    ],
                    templateOptions: {
                      required: false,
                      label: 'Visa Expiry Date',
                      type: 'date'
                    },
                    read_only: false
                  }
                ],
                width: 0.25
              },
              {
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/countries/',
                    read_only: false,
                    templateOptions: {
                      label: 'Nationality',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    key: 'nationality',
                    many: false
                  },
                  {
                    key: 'vevo_checked_at',
                    type: 'datepicker',
                    showIf: [
                      {
                        residency: 3
                      }
                    ],
                    templateOptions: {
                      required: false,
                      label: 'VEVO checked at',
                      type: 'date'
                    },
                    read_only: false
                  }
                ],
                width: 0.25
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                label: 'Formalities',
                type: 'group',
                children: [
                  {
                    key: 'tax_file_number',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Tax File Number',
                      max: 9,
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/candidate/superannuationfunds/',
                    read_only: false,
                    templateOptions: {
                      label: 'Superannuation fund',
                      add: true,
                      delete: false,
                      values: ['__str__', 'name', 'membership_number'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    key: 'superannuation_fund',
                    many: false
                  },
                  {
                    key: 'superannuation_fund.name',
                    type: 'input',
                    showIf: ['superannuation_fund.id'],
                    default: '{superannuation_fund.name}',
                    templateOptions: {
                      required: false,
                      label: 'Name',
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    key: 'superannuation_fund.membership_number',
                    type: 'input',
                    showIf: ['superannuation_fund.id'],
                    default: '{superannuation_fund.membership_number}',
                    templateOptions: {
                      required: false,
                      label: 'Employer Membership Number',
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    key: 'super_member_number',
                    type: 'input',
                    showIf: ['superannuation_fund.id'],
                    templateOptions: {
                      required: false,
                      label: 'Super Member Number',
                      max: 63,
                      type: 'text'
                    },
                    read_only: false
                  }
                ],
                width: 0.25
              },
              {
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/bankaccounts/',
                    read_only: false,
                    templateOptions: {
                      label: 'Bank account',
                      add: true,
                      delete: false,
                      values: ['__str__', 'bsb', 'account_number'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    key: 'bank_account',
                    many: false
                  },
                  {
                    key: 'bank_account.bsb',
                    type: 'input',
                    showIf: ['bank_account.id'],
                    default: '{bank_account.bsb}',
                    send: false,
                    templateOptions: {
                      required: false,
                      label: 'BSB',
                      max: 63,
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    key: 'bank_account.account_number',
                    type: 'input',
                    showIf: ['bank_account.id'],
                    default: '{bank_account.account_number}',
                    send: false,
                    templateOptions: {
                      required: false,
                      label: 'Account Number',
                      max: 63,
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/skills/employmentclassifications/',
                    read_only: false,
                    templateOptions: {
                      label: 'Employment classification',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    key: 'employment_classification',
                    many: false
                  }
                ],
                width: 0.5
              },
              {
                label: 'Emergency',
                type: 'group',
                children: [
                  {
                    key: 'emergency_contact_name',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Emergency Contact Name',
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
                      label: 'Emergency Contact Phone Number',
                      type: 'text'
                    },
                    read_only: false
                  }
                ],
                width: 0.25
              }
            ]
          }
        ]
      },
      {
        endpoint: '/ecore/api/v2/candidate/skillrels/',
        templateOptions: {
          label: 'Candidate skills',
          type: 'list',
          add_label: '+ Add item',
          text: 'Candidate skills'
        },
        collapsed: false,
        prefilled: {
          candidate_contact: '{id}'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see the skills which belong to the candidate'
      },
      {
        endpoint: '/ecore/api/v2/candidate/tagrels/',
        templateOptions: {
          label: 'Candidate tags',
          type: 'list',
          add_label: '+ Add item',
          text: 'Candidate tags'
        },
        collapsed: false,
        prefilled: {
          candidate_contact: '{id}'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see the tags which belong to the candidate'
      },
      {
        name: 'States',
        type: 'group',
        children: [
          {
            key: 'timeline',
            type: 'timeline',
            query: {
              model: 'candidate.candidatecontact',
              object_id: ['{id.id}', '{id}']
            },
            templateOptions: {
              label: '',
              type: 'timeline',
              text: ''
            },
            endpoint: '/ecore/api/v2/core/workflownodes/timeline/'
          },
          {
            endpoint: '/ecore/api/v2/core/workflowobjects/',
            templateOptions: {
              label: 'States history',
              type: 'list',
              add_label: '+ Add item',
              text: 'States history'
            },
            collapsed: false,
            prefilled: {
              object_id: '{id}'
            },
            type: 'list',
            query: {
              object_id: '{id}'
            },
            help: 'Here you can see changes candidate states'
          }
        ]
      },
      {
        endpoint: '/ecore/api/v2/core/contactunavailabilities/',
        type: 'list',
        query: {
          contact: '{contact.id}'
        },
        templateOptions: {
          label: 'Unavailabilities',
          type: 'list',
          text: 'Unavailabilities'
        },
        collapsed: false
      },
      {
        endpoint: '/ecore/api/v2/hr/joboffers/candidate/',
        templateOptions: {
          label: 'Job offers',
          type: 'list',
          text: 'Job offers'
        },
        collapsed: false,
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see job offers'
      },
      {
        endpoint: '/ecore/api/v2/hr/carrierlists/',
        templateOptions: {
          label: 'Carrier List',
          type: 'list',
          add_label: '+ Add item',
          text: 'Carrier List'
        },
        collapsed: false,
        prefilled: {
          candidate_contact: '{id}'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see information about carrier of candidate'
      },
      {
        endpoint: '/ecore/api/v2/hr/blacklists/',
        templateOptions: {
          label: 'Black List',
          type: 'list',
          add_label: '+ Add item',
          text: 'Black List'
        },
        collapsed: false,
        prefilled: {
          candidate_contact: '{id}'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        }
      },
      {
        endpoint: '/ecore/api/v2/hr/favouritelists/',
        templateOptions: {
          label: 'Favorite List',
          type: 'list',
          add_label: '+ Add item',
          text: 'Favorite List'
        },
        collapsed: false,
        prefilled: {
          candidate_contact: '{id}'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see favorite companies for candidate'
      },
      {
        endpoint: '/ecore/api/v2/hr/candidateevaluations/',
        templateOptions: {
          label: 'Evaluations',
          type: 'list',
          text: 'Evaluations'
        },
        collapsed: false,
        prefilled: {
          candidate_contact: '{id}'
        },
        type: 'list',
        query: {
          candidate_contact: '{id}'
        },
        help: 'Here you can see evaluations for the candidate'
      }
    ]
  }
];

const formadd = [
  {
    many: false,
    key: 'contact',
    endpoint: '/ecore/api/v2/core/contacts/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Contact',
      type: 'related'
    },
    read_only: false,
    type: 'related'
  },
  {
    children: [
      {
        name: 'Personal Info',
        label: 'Personal information',
        children: [
          {
            children: [
              {
                label: 'Notify',
                children: [
                  {
                    default: false,
                    key: 'message_by_email',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'E-Mail',
                      type: 'checkbox'
                    },
                    type: 'checkbox'
                  },
                  {
                    default: false,
                    key: 'message_by_sms',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'SMS',
                      type: 'checkbox'
                    },
                    type: 'checkbox'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                label: 'Recruitment agent',
                children: [
                  {
                    many: false,
                    key: 'recruitment_agent',
                    endpoint: '/ecore/api/v2/core/companycontacts/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: '',
                      type: 'related'
                    },
                    read_only: false,
                    default: 'session.contact.contact_id',
                    type: 'related',
                    query: {
                      master_company: 'current'
                    }
                  },
                  {
                    key: 'recruitment_agent.contact.phone_mobile',
                    read_only: true,
                    templateOptions: {
                      required: false,
                      label: '',
                      type: 'text'
                    },
                    type: 'input',
                    send: false
                  },
                  {
                    hide: true,
                    key: 'recruitment_agent.contact',
                    templateOptions: {
                      required: true,
                      label: '',
                      type: 'text'
                    },
                    read_only: false,
                    type: 'input',
                    send: false
                  }
                ],
                type: 'group',
                width: 0.25
              }
            ],
            type: 'row'
          },
          {
            children: [
              {
                label: 'Additional info',
                children: [
                  {
                    default: 0,
                    key: 'language',
                    read_only: false,
                    templateOptions: {
                      min: 0,
                      required: false,
                      label: 'Language',
                      max: 5,
                      type: 'score'
                    },
                    type: 'static'
                  },
                  {
                    key: 'transportation_to_work',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Transportation to Work',
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
                    type: 'select'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                label: 'Phisical parameters',
                children: [
                  {
                    key: 'height',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Height, cm',
                      type: 'text'
                    },
                    type: 'input'
                  },
                  {
                    key: 'weight',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Weight, kg',
                      type: 'number'
                    },
                    type: 'input'
                  },
                  {
                    key: 'bmi',
                    read_only: true,
                    templateOptions: {
                      required: false,
                      label: 'Bmi',
                      type: 'static'
                    },
                    type: 'static'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                label: 'Character',
                children: [
                  {
                    default: 0,
                    key: 'strength',
                    read_only: false,
                    templateOptions: {
                      min: 0,
                      required: false,
                      label: 'Strength',
                      max: 5,
                      type: 'score'
                    },
                    type: 'static'
                  }
                ],
                type: 'group',
                width: 0.25
              }
            ],
            type: 'row'
          },
          {
            children: [
              {
                label: 'Residency',
                children: [
                  {
                    default: 0,
                    key: 'residency',
                    read_only: false,
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
                    type: 'select'
                  },
                  {
                    showIf: [
                      {
                        residency: 3
                      }
                    ],
                    key: 'visa_expiry_date',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Visa Expiry Date',
                      type: 'date'
                    },
                    type: 'datepicker'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                children: [
                  {
                    many: false,
                    key: 'nationality',
                    endpoint: '/ecore/api/v2/core/countries/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: 'Nationality',
                      type: 'related'
                    },
                    read_only: false,
                    type: 'related'
                  },
                  {
                    showIf: [
                      {
                        residency: 3
                      }
                    ],
                    key: 'vevo_checked_at',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'VEVO checked at',
                      type: 'date'
                    },
                    type: 'datepicker'
                  }
                ],
                type: 'group',
                width: 0.25
              }
            ],
            type: 'row'
          },
          {
            children: [
              {
                label: 'Formalities',
                children: [
                  {
                    key: 'tax_file_number',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Tax File Number',
                      max: 9,
                      type: 'text'
                    },
                    type: 'input'
                  },
                  {
                    many: false,
                    key: 'superannuation_fund',
                    endpoint: '/ecore/api/v2/candidate/superannuationfunds/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: 'Superannuation fund',
                      type: 'related'
                    },
                    read_only: false,
                    type: 'related'
                  },
                  {
                    showIf: ['superannuation_fund.id'],
                    key: 'super_member_number',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Super Member Number',
                      max: 63,
                      type: 'text'
                    },
                    type: 'input'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                children: [
                  {
                    many: false,
                    key: 'bank_account',
                    endpoint: '/ecore/api/v2/core/bankaccounts/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: 'Bank account',
                      type: 'related'
                    },
                    read_only: false,
                    type: 'related'
                  },
                  {
                    many: false,
                    key: 'employment_classification',
                    endpoint: '/ecore/api/v2/skills/employmentclassifications/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: 'Employment classification',
                      type: 'related'
                    },
                    read_only: false,
                    type: 'related'
                  }
                ],
                type: 'group',
                width: 0.5
              },
              {
                label: 'Emergency',
                children: [
                  {
                    key: 'emergency_contact_name',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Emergency Contact Name',
                      max: 63,
                      type: 'text'
                    },
                    type: 'input'
                  },
                  {
                    key: 'emergency_contact_phone',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Emergency Contact Phone Number',
                      type: 'text'
                    },
                    type: 'input'
                  }
                ],
                type: 'group',
                width: 0.25
              }
            ],
            type: 'row'
          }
        ],
        type: 'group',
        main: true
      }
    ],
    type: 'tabs'
  }
];

const contact = [
  {
    many: false,
    key: 'contact',
    endpoint: '/ecore/api/v2/core/contacts/',
    collapsed: false,
    list: false,
    templateOptions: {
      add: true,
      delete: false,
      edit: true,
      values: ['__str__'],
      label: 'Contact',
      type: 'related'
    },
    read_only: false,
    type: 'related'
  },
  {
    children: [
      {
        name: 'Personal Info',
        label: 'Personal information',
        children: [
          {
            children: [
              {
                label: 'Notify',
                children: [
                  {
                    default: false,
                    key: 'message_by_email',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'E-Mail',
                      type: 'checkbox'
                    },
                    type: 'checkbox'
                  },
                  {
                    default: false,
                    key: 'message_by_sms',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'SMS',
                      type: 'checkbox'
                    },
                    type: 'checkbox'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                label: 'Recruitment agent',
                children: [
                  {
                    many: false,
                    key: 'recruitment_agent',
                    endpoint: '/ecore/api/v2/core/companycontacts/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: '',
                      type: 'related'
                    },
                    read_only: false,
                    default: 'session.contact.contact_id',
                    type: 'related',
                    query: {
                      master_company: 'current'
                    }
                  },
                  {
                    key: 'recruitment_agent.contact.phone_mobile',
                    read_only: true,
                    templateOptions: {
                      required: false,
                      label: '',
                      type: 'text'
                    },
                    type: 'input',
                    send: false
                  },
                  {
                    hide: true,
                    key: 'recruitment_agent.contact',
                    templateOptions: {
                      required: true,
                      label: '',
                      type: 'text'
                    },
                    read_only: false,
                    type: 'input',
                    send: false
                  }
                ],
                type: 'group',
                width: 0.25
              }
            ],
            type: 'row'
          },
          {
            children: [
              {
                label: 'Additional info',
                children: [
                  {
                    default: 0,
                    key: 'language',
                    read_only: false,
                    templateOptions: {
                      min: 0,
                      required: false,
                      label: 'Language',
                      max: 5,
                      type: 'score'
                    },
                    type: 'static'
                  },
                  {
                    key: 'transportation_to_work',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Transportation to Work',
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
                    type: 'select'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                label: 'Phisical parameters',
                children: [
                  {
                    key: 'height',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Height, cm',
                      type: 'text'
                    },
                    type: 'input'
                  },
                  {
                    key: 'weight',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Weight, kg',
                      type: 'number'
                    },
                    type: 'input'
                  },
                  {
                    key: 'bmi',
                    read_only: true,
                    templateOptions: {
                      required: false,
                      label: 'Bmi',
                      type: 'static'
                    },
                    type: 'static'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                label: 'Character',
                children: [
                  {
                    default: 0,
                    key: 'strength',
                    read_only: false,
                    templateOptions: {
                      min: 0,
                      required: false,
                      label: 'Strength',
                      max: 5,
                      type: 'score'
                    },
                    type: 'static'
                  }
                ],
                type: 'group',
                width: 0.25
              }
            ],
            type: 'row'
          },
          {
            children: [
              {
                label: 'Residency',
                children: [
                  {
                    default: 0,
                    key: 'residency',
                    read_only: false,
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
                    type: 'select'
                  },
                  {
                    showIf: [
                      {
                        residency: 3
                      }
                    ],
                    key: 'visa_expiry_date',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Visa Expiry Date',
                      type: 'date'
                    },
                    type: 'datepicker'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                children: [
                  {
                    many: false,
                    key: 'nationality',
                    endpoint: '/ecore/api/v2/core/countries/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: 'Nationality',
                      type: 'related'
                    },
                    read_only: false,
                    type: 'related'
                  },
                  {
                    showIf: [
                      {
                        residency: 3
                      }
                    ],
                    key: 'vevo_checked_at',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'VEVO checked at',
                      type: 'date'
                    },
                    type: 'datepicker'
                  }
                ],
                type: 'group',
                width: 0.25
              }
            ],
            type: 'row'
          },
          {
            children: [
              {
                label: 'Formalities',
                children: [
                  {
                    key: 'tax_file_number',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Tax File Number',
                      max: 9,
                      type: 'text'
                    },
                    type: 'input'
                  },
                  {
                    many: false,
                    key: 'superannuation_fund',
                    endpoint: '/ecore/api/v2/candidate/superannuationfunds/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: 'Superannuation fund',
                      type: 'related'
                    },
                    read_only: false,
                    type: 'related'
                  },
                  {
                    showIf: ['superannuation_fund.id'],
                    key: 'super_member_number',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Super Member Number',
                      max: 63,
                      type: 'text'
                    },
                    type: 'input'
                  }
                ],
                type: 'group',
                width: 0.25
              },
              {
                children: [
                  {
                    many: false,
                    key: 'bank_account',
                    endpoint: '/ecore/api/v2/core/bankaccounts/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: 'Bank account',
                      type: 'related'
                    },
                    read_only: false,
                    type: 'related'
                  },
                  {
                    many: false,
                    key: 'employment_classification',
                    endpoint: '/ecore/api/v2/skills/employmentclassifications/',
                    collapsed: false,
                    list: false,
                    templateOptions: {
                      add: true,
                      delete: false,
                      edit: true,
                      values: ['__str__'],
                      label: 'Employment classification',
                      type: 'related'
                    },
                    read_only: false,
                    type: 'related'
                  }
                ],
                type: 'group',
                width: 0.5
              },
              {
                label: 'Emergency',
                children: [
                  {
                    key: 'emergency_contact_name',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Emergency Contact Name',
                      max: 63,
                      type: 'text'
                    },
                    type: 'input'
                  },
                  {
                    key: 'emergency_contact_phone',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Emergency Contact Phone Number',
                      type: 'text'
                    },
                    type: 'input'
                  }
                ],
                type: 'group',
                width: 0.25
              }
            ],
            type: 'row'
          }
        ],
        type: 'group',
        main: true
      }
    ],
    type: 'tabs'
  }
];

export const metadata = {
  list,
  form,
  formadd,
  contact
};
