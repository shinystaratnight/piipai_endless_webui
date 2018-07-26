const list = {
  list: {
    list: 'contact',
    label: 'Contact',
    columns: [
      {
        content: [
          {
            values: {
              available: 'availability',
              address: 'address.__str__',
              title: '__str__',
              picture: 'picture.origin'
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
            field: 'email',
            type: 'link',
            label: 'E-mail',
            link: 'mailto:{email}'
          },
          {
            field: 'phone_mobile',
            type: 'link',
            link: 'tel:{phone_mobile}'
          }
        ],
        name: 'contact',
        title: null,
        label: 'Contact',
        delim: null
      },
      {
        content: [
          {
            endpoint:
              '/ecore/api/v2/candidate/candidatecontacts/{candidate_contacts.id}',
            field: 'candidate_contacts',
            type: 'link',
            display: 'Candidate',
            inline: true
          },
          {
            endpoint: '/ecore/api/v2/core/companycontacts/{company_contact.id}',
            field: 'company_contact',
            type: 'link',
            display: 'Company Contact',
            inline: true
          },
          {
            endpoint: '/ecore/api/v2/core/companies/{master_company.id}',
            field: 'master_company',
            type: 'link',
            display: 'Master Company',
            inline: true
          }
        ],
        name: 'relations',
        title: null,
        label: 'Relations',
        delim: null
      }
    ],
    pagination_label: 'Contact',
    search_enabled: true,
    editDisable: false,
    filters: [
      {
        key: 'state',
        label: 'State',
        options: [
          {
            value: '052a4f5e-27f9-45bb-b664-5da958d8553f',
            label: 'ACT'
          },
          {
            value: '0cb841f6-6462-4a9d-9e79-d590adc52c6b',
            label: 'Tasmania'
          },
          {
            value: '534ba565-8b6c-4a3c-b587-9f4c1f636e13',
            label: 'Victoria'
          },
          {
            value: '613f3583-b8e7-40f4-97b1-3c851176e3e5',
            label: 'New South Wales'
          },
          {
            value: '8df75dfd-ba2c-47f6-b377-12bed7abbe2f',
            label: 'Northern Territory'
          },
          {
            value: '9e8bb936-a4ff-4b1d-ac61-afff7cd2a78a',
            label: 'Western Australia'
          },
          {
            value: 'ce446764-be32-427d-a413-1af16fe3b5bb',
            label: 'Queensland'
          },
          {
            value: 'da6e1f8d-3e3d-4df6-81d7-b867a43e774a',
            label: 'South Australia'
          }
        ],
        query: 'state',
        default: null,
        type: 'select'
      },
      {
        key: 'contact_type',
        label: 'Type of Contact',
        options: [
          {
            value: 'candidate',
            label: 'Candidate'
          },
          {
            value: 'client',
            label: 'Client'
          },
          {
            value: 'manager',
            label: 'Manager'
          }
        ],
        query: 'contact_type',
        default: null,
        type: 'select'
      },
      {
        key: 'is_available',
        label: 'Available',
        options: [
          {
            value: 'True',
            label: 'Yes'
          },
          {
            value: 'False',
            label: 'No'
          }
        ],
        query: 'is_available',
        default: null,
        type: 'checkbox'
      },
      {
        key: 'phone_mobile_verified',
        label: 'Mobile Phone Verified',
        options: [
          {
            value: 'True',
            label: 'Yes'
          },
          {
            value: 'False',
            label: 'No'
          }
        ],
        query: 'phone_mobile_verified',
        default: null,
        type: 'checkbox'
      },
      {
        key: 'email_verified',
        label: 'E-mail Verified',
        options: [
          {
            value: 'True',
            label: 'Yes'
          },
          {
            value: 'False',
            label: 'No'
          }
        ],
        query: 'email_verified',
        default: null,
        type: 'checkbox'
      }
    ]
  },
  fields: [
    {
      key: 'company_contact',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: null,
        text: ''
      },
      read_only: true
    },
    {
      read_only: true,
      values: {
        available: 'availability',
        address: 'address.__str__',
        title: '__str__',
        picture: 'picture.thumb'
      },
      type: 'info',
      key: 'id'
    },
    {
      key: 'candidate_contacts',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: null,
        text: ''
      },
      read_only: true
    },
    {
      key: 'email',
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
      key: 'master_company',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: null,
        text: ''
      },
      read_only: true
    },
    {
      key: 'phone_mobile',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: 'tel:{field}',
        text: ''
      },
      read_only: true
    }
  ]
};

const form = [
  {
    values: {
      title_title: 'title',
      first_name: 'first_name',
      created_at: 'created_at',
      last_name: 'last_name',
      available: 'is_available',
      address: 'address.__str__',
      title: '__str__',
      updated_at: 'updated_at',
      picture: 'picture'
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
                    key: 'email',
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
                    key: 'phone_mobile',
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
                width: 0.34
              },
              {
                label: 'Verification',
                type: 'group',
                children: [
                  {
                    key: 'email_verified',
                    default: false,
                    type: 'checkbox',
                    templateOptions: {
                      required: false,
                      label: 'E-mail Verified',
                      type: 'checkbox'
                    },
                    read_only: false
                  },
                  {
                    key: 'phone_mobile_verified',
                    default: false,
                    type: 'checkbox',
                    templateOptions: {
                      required: false,
                      label: 'Phone Verified',
                      type: 'checkbox'
                    },
                    read_only: false
                  }
                ],
                width: 0.33
              },
              {
                label: 'Additional Info',
                type: 'group',
                children: [
                  {
                    key: 'gender',
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
                    key: 'birthday',
                    type: 'datepicker',
                    templateOptions: {
                      required: false,
                      label: 'Birthday',
                      type: 'date',
                      description:
                        'Optional for Client Contacts, must be filled for Candidate Contacts'
                    },
                    read_only: false
                  }
                ],
                width: 0.33
              }
            ]
          },
          {
            type: 'row',
            children: [
              {
                label: 'Relations',
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/users/',
                    read_only: true,
                    metadata_query: {
                      fieldsets_type: 'contact'
                    },
                    templateOptions: {
                      label: 'User',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    send: false,
                    type: 'related',
                    key: 'user',
                    many: false
                  },
                  {
                    endpoint: '/ecore/api/v2/candidate/candidatecontacts/',
                    doNotChoice: true,
                    add_metadata_query: {
                      fieldsets_type: 'contact'
                    },
                    templateOptions: {
                      label: 'Candidate Contact',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      edit: true
                    },
                    send: false,
                    prefilled: {
                      contact: '{id.id}'
                    },
                    type: 'related',
                    key: 'candidate_contacts',
                    many: false
                  }
                ],
                width: 0.25
              },
              {
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/companycontacts/',
                    doNotChoice: true,
                    templateOptions: {
                      label: 'Company Contact',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      edit: true
                    },
                    send: false,
                    prefilled: {
                      contact: '{id.id}'
                    },
                    type: 'related',
                    key: 'company_contact',
                    many: true
                  }
                ],
                width: 0.25
              },
              {
                label: 'Additional Info',
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/companycontacts/',
                    read_only: true,
                    templateOptions: {
                      label: 'Recruitment Agent',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    send: false,
                    type: 'related',
                    key: 'candidate_contacts.recruitment_agent',
                    many: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/companies/',
                    read_only: true,
                    templateOptions: {
                      label: 'Master Company',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    send: false,
                    type: 'related',
                    key: 'master_company',
                    many: false
                  }
                ],
                width: 0.25
              }
            ]
          }
        ]
      },
      {
        endpoint: '/ecore/api/v2/core/notes/',
        templateOptions: {
          label: 'Notes',
          type: 'list',
          add_label: 'Add',
          text: 'Notes'
        },
        collapsed: false,
        prefilled: {
          object_id: '{id}'
        },
        type: 'list',
        query: {
          object_id: '{id}'
        }
      }
    ]
  },
  {
    list: false,
    endpoint: '/ecore/api/v2/core/addresses/',
    read_only: false,
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
    type: 'address',
    key: 'address',
    many: false
  },
  {
    key: 'is_available',
    read_only: false,
    hide: true,
    templateOptions: {
      required: false,
      label: 'Available',
      type: 'checkbox'
    },
    send: false,
    default: false,
    type: 'checkbox'
  },
  {
    key: 'first_name',
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
    key: 'last_name',
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
    key: 'title',
    type: 'select',
    hide: true,
    templateOptions: {
      required: true,
      label: 'Title',
      type: 'select',
      options: [
        {
          value: 'Mr.',
          label: 'Mr.'
        },
        {
          value: 'Ms.',
          label: 'Ms.'
        },
        {
          value: 'Mrs.',
          label: 'Mrs.'
        },
        {
          value: 'Dr.',
          label: 'Dr.'
        }
      ]
    },
    read_only: false
  },
  {
    key: 'id',
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
    key: 'picture',
    read_only: false,
    templateOptions: {
      required: false,
      label: 'Picture',
      type: 'picture',
      file: false
    },
    hide: true,
    default: 'contact_pictures/default_picture.jpg',
    type: 'input'
  }
];

const formadd = [
  {
    label: 'General',
    type: 'row',
    children: [
      {
        type: 'column',
        children: [
          {
            key: 'title',
            type: 'select',
            templateOptions: {
              required: true,
              label: 'Title',
              type: 'select',
              options: [
                {
                  value: 'Mr.',
                  label: 'Mr.'
                },
                {
                  value: 'Ms.',
                  label: 'Ms.'
                },
                {
                  value: 'Mrs.',
                  label: 'Mrs.'
                },
                {
                  value: 'Dr.',
                  label: 'Dr.'
                }
              ]
            },
            read_only: false
          },
          {
            key: 'first_name',
            type: 'input',
            templateOptions: {
              required: true,
              label: 'First Name',
              max: 255,
              type: 'text'
            },
            read_only: false
          },
          {
            key: 'last_name',
            type: 'input',
            templateOptions: {
              required: true,
              label: 'Last Name',
              max: 255,
              type: 'text'
            },
            read_only: false
          },
          {
            key: 'gender',
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
          }
        ]
      },
      {
        type: 'column',
        children: [
          {
            key: 'email',
            type: 'input',
            templateOptions: {
              required: true,
              label: 'E-mail',
              max: 255,
              type: 'email'
            },
            read_only: false
          },
          {
            key: 'phone_mobile',
            type: 'input',
            templateOptions: {
              required: true,
              label: 'Mobile Phone',
              type: 'text'
            },
            read_only: false
          },
          {
            key: 'birthday',
            type: 'datepicker',
            templateOptions: {
              required: false,
              label: 'Birthday',
              type: 'date',
              description:
                'Optional for Client Contacts, must be filled for Candidate contacts'
            },
            read_only: false
          },
          {
            list: false,
            endpoint: '/ecore/api/v2/core/addresses/',
            read_only: false,
            templateOptions: {
              label: 'Address',
              add: true,
              delete: false,
              values: ['__str__'],
              type: 'address',
              edit: true
            },
            collapsed: false,
            type: 'address',
            key: 'address',
            many: false
          }
        ]
      }
    ]
  }
];

export const metadata = {
  list,
  form,
  formadd
};
