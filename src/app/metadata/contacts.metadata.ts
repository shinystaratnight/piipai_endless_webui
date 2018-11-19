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
              '/candidate/candidatecontacts/{candidate_contacts.id}',
            field: 'candidate_contacts',
            type: 'link',
            display: 'Candidate contact',
            inline: true
          },
          {
            endpoint: '/core/companycontacts/{company_contact.id}/change',
            field: 'company_contact',
            type: 'link',
            display: 'Client contact',
            inline: true
          },
          {
            endpoint: '/core/companies/{master_company.id}',
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
        data: {
          value: 'name',
          endpoint: '/core/regions/?country=AU',
          key: 'id'
        },
        query: 'state',
        default: null,
        type: 'related'
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
        multiple: false,
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
        multiple: false,
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
        multiple: false,
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
        picture: 'picture.origin'
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
                    endpoint: '/core/users/',
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
                    endpoint: '/candidate/candidatecontacts/',
                    doNotChoice: true,
                    templateOptions: {
                      label: 'Candidate Contact',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      edit: true
                    },
                    send: false,
                    errorMessage: {
                      field: 'birthday',
                      message: 'Birthday is required'
                    },
                    prefilled: {
                      contact: '{id.id}',
                      birthday: '{birthday}'
                    },
                    type: 'related',
                    key: 'candidate_contacts',
                  }
                ],
                width: 0.25
              },
              {
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/core/companycontacts/',
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
                    endpoint: '/core/companycontacts/',
                    read_only: true,
                    templateOptions: {
                      label: 'Recruitment Agent',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    visibleMode: true,
                    send: false,
                    type: 'related',
                    key: 'candidate_contacts.recruitment_agent',
                    many: false
                  },
                  {
                    list: false,
                    endpoint: '/core/companies/',
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
        endpoint: '/core/notes/',
        templateOptions: {
          label: 'Notes',
          type: 'list',
          add_label: '+ Add',
          text: 'Notes'
        },
        collapsed: false,
        prefilled: {
          object_id: '{id}',
          content_type: '{model_content_type}',
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
    endpoint: '/core/addresses/',
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
        ]
      },
      {
        type: 'column',
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
                'Optional for Client Contacts, must be filled for Candidate contacts'
            },
            read_only: false
          },
          {
            list: false,
            endpoint: '/core/addresses/',
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
