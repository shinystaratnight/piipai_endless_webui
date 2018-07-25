const list = {
  list: {
    list: 'company',
    label: 'Client',
    columns: [
      {
        content: [
          {
            values: {
              available: 'available',
              address: 'address.__str__',
              description: 'description',
              title: 'name',
              picture: 'logo.thumb'
            },
            field: 'id',
            type: 'info',
            label: 'Client Info'
          }
        ],
        name: 'client_info',
        title: null,
        label: 'Client Info',
        delim: null
      },
      {
        content: [
          {
            endpoint: '/ecore/api/v2/core/companycontacts/{manager.id}/',
            field: 'manager.contact',
            type: 'link',
            display: '{manager.job_title}'
          },
          {
            field: 'manager.contact.email',
            type: 'link',
            label: 'E-mail',
            link: 'mailto:{manager.contact.email}'
          },
          {
            field: 'manager.contact.phone_mobile',
            type: 'link',
            link: 'tel:{manager.contact.phone_mobile}'
          }
        ],
        name: 'primary_contact',
        title: null,
        label: 'Primary Contact',
        delim: null
      },
      {
        delim: null,
        label: 'Manager',
        sort: true,
        content: [
          {
            endpoint:
              '/ecore/api/v2/core/companycontacts/{primary_contact.id}/',
            field: 'primary_contact',
            type: 'link',
            label: 'Manager',
            display: '{primary_contact.job_title}'
          }
        ],
        name: 'manager',
        title: null,
        sort_field: 'manager'
      },
      {
        content: [
          {
            field: 'credit_approved',
            type: 'static'
          },
          {
            values: {
              false: 'circle',
              true: 'circle',
              null: 'minus-circle'
            },
            field: 'credit_check',
            type: 'icon',
            color: {
              false: 'danger',
              true: 'success'
            }
          },
          {
            field: 'approved_credit_limit',
            type: 'static'
          },
          {
            field: 'terms_of_pay',
            type: 'static'
          }
        ],
        name: 'credit_info',
        title: null,
        label: 'Credit Info',
        delim: null
      },
      {
        content: [
          {
            field: 'latest_state',
            outline: true,
            type: 'tags',
            color: {
              danger: [0, 80, 90]
            },
            label: 'Client State',
            color_attr: 'number'
          }
        ],
        name: 'client_state',
        title: null,
        label: 'Client State',
        delim: null
      }
    ],
    pagination_label: 'Clients',
    search_enabled: true,
    editDisable: false,
    filters: [
      {
        key: 'status',
        label: 'Status',
        options: [
          {
            value: 0,
            label: 'Sales Failed'
          },
          {
            value: 10,
            label: 'Found Lead'
          },
          {
            value: 20,
            label: 'Analyzed'
          },
          {
            value: 30,
            label: 'Qualified Lead'
          },
          {
            value: 40,
            label: 'Proposal Presented'
          },
          {
            value: 60,
            label: 'Contract Signed'
          },
          {
            value: 70,
            label: 'Extranet Access'
          },
          {
            value: 80,
            label: 'Credit Hold'
          },
          {
            value: 90,
            label: 'Contract Terminated'
          }
        ],
        query: 'status',
        default: null,
        type: 'select'
      },
      {
        key: 'portfolio_manager',
        label: 'Portfolio Manager',
        type: 'related',
        data: {
          value: '__str__',
          endpoint: '/ecore/api/v2/core/companycontacts/',
          key: 'id'
        },
        query: 'portfolio_manager'
      },
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
        key: 'credit_check',
        label: 'Credit Check',
        options: [
          {
            value: 'True',
            label: 'Approved'
          },
          {
            value: 'False',
            label: 'Unapproved'
          }
        ],
        query: 'credit_check',
        default: null,
        type: 'select'
      },
      {
        key: 'approved_credit_limit',
        label: 'Credit Limit',
        max: null,
        input: [
          {
            label: 'From',
            query: 'approved_credit_limit_0'
          },
          {
            label: 'To',
            query: 'approved_credit_limit_1'
          }
        ],
        default: null,
        type: 'range',
        min: null
      }
    ]
  },
  fields: [
    {
      key: 'terms_of_pay',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Terms of pay',
        type: 'static'
      },
      read_only: true
    },
    {
      key: 'credit_approved',
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Credit approved',
        type: 'static'
      },
      read_only: true
    },
    {
      key: 'primary_contact',
      type: 'link',
      templateOptions: {
        label: 'Manager',
        type: 'link',
        link: null,
        text: 'Manager'
      },
      read_only: true
    },
    {
      key: 'credit_check',
      default: false,
      type: 'checkbox',
      templateOptions: {
        required: false,
        label: 'Credit Check',
        options: [
          {
            value: true,
            label: 'Approved'
          },
          {
            value: false,
            label: 'Not Approved'
          }
        ],
        values: {
          false: 'circle',
          true: 'circle',
          null: 'minus-circle'
        },
        type: 'icon',
        color: {
          false: 'danger',
          true: 'success'
        }
      },
      read_only: true
    },
    {
      read_only: true,
      values: {
        available: 'available',
        address: 'address.__str__',
        description: 'description',
        title: 'name',
        picture: 'logo.thumb'
      },
      type: 'info',
      key: 'id'
    },
    {
      key: 'latest_state',
      type: 'tags',
      templateOptions: {
        required: false,
        label: 'Client State',
        type: 'tags',
        color: {
          danger: [0, 80, 90]
        },
        color_attr: 'number'
      },
      read_only: true
    },
    {
      key: 'manager.contact.phone_mobile',
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
      key: 'manager.contact.email',
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
      key: 'approved_credit_limit',
      default: 0.0,
      type: 'static',
      templateOptions: {
        required: false,
        label: 'Approved Credit Limit',
        type: 'static'
      },
      read_only: true
    },
    {
      key: 'manager.contact',
      type: 'link',
      templateOptions: {
        label: '',
        type: 'link',
        link: null,
        text: ''
      },
      read_only: true
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
      address: 'address.__str__',
      title: 'name',
      updated_at: 'updated_at',
      link: 'website',
      picture: 'logo'
    },
    type: 'info',
    key: 'id'
  },
  {
    type: 'tabs',
    children: [
      {
        main: true,
        name: 'General Info',
        type: 'group',
        label: 'General information',
        children: [
          {
            type: 'row',
            children: [
              {
                label: 'Primary Contact',
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/companycontacts/',
                    read_only: false,
                    key: 'manager',
                    templateOptions: {
                      label: 'Name',
                      add: true,
                      delete: false,
                      values: ['contact'],
                      type: 'related',
                      edit: true,
                      display: '{contact.__str__}'
                    },
                    collapsed: false,
                    prefilled: {
                      company: '{id.id}'
                    },
                    type: 'related',
                    query: {
                      company: '{id.id}'
                    },
                    many: false
                  },
                  {
                    key: 'manager.job_title',
                    send: false,
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Job Title',
                      max: 31,
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    key: 'manager.contact.email',
                    send: false,
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'E-mail',
                      max: 255,
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    key: 'manager.contact.phone_mobile',
                    send: false,
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Phone number',
                      type: 'text'
                    },
                    read_only: true
                  }
                ],
                width: 0.25
              },
              {
                label: 'Additional Info',
                type: 'group',
                children: [
                  {
                    key: 'business_id',
                    type: 'input',
                    templateOptions: {
                      required: true,
                      label: 'Business Number',
                      max: 31,
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/pricing/industries/',
                    read_only: false,
                    templateOptions: {
                      label: 'Industry',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    type: 'related',
                    key: 'industry',
                    many: false
                  },
                  {
                    key: 'registered_for_gst',
                    default: false,
                    type: 'checkbox',
                    templateOptions: {
                      required: false,
                      label: 'GST',
                      type: 'checkbox',
                      text: 'Registered'
                    },
                    read_only: false
                  },
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/companies/',
                    read_only: false,
                    key: 'master_company',
                    templateOptions: {
                      label: 'Master company',
                      add: true,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    showIf: [
                      {
                        type: 'regular'
                      }
                    ],
                    type: 'related',
                    query: {
                      type: 'master'
                    },
                    many: false
                  }
                ],
                width: 0.25
              },
              {
                label: 'Portfolio Manager',
                type: 'group',
                children: [
                  {
                    list: false,
                    endpoint: '/ecore/api/v2/core/companycontacts/',
                    read_only: false,
                    key: 'primary_contact',
                    templateOptions: {
                      label: 'Name',
                      add: false,
                      delete: false,
                      values: ['__str__'],
                      type: 'related',
                      edit: true
                    },
                    collapsed: false,
                    showIf: [
                      {
                        type: 'regular'
                      }
                    ],
                    type: 'related',
                    query: {
                      company: '{master_company.id}'
                    },
                    many: false
                  },
                  {
                    key: 'primary_contact_phone',
                    send: false,
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Phone number',
                      type: 'text'
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
                label: 'Credit Info',
                type: 'group',
                children: [
                  {
                    key: 'credit_check',
                    default: false,
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'Credit Check',
                      type: 'select',
                      options: [
                        {
                          value: true,
                          label: 'Approved'
                        },
                        {
                          value: false,
                          label: 'Not Approved'
                        }
                      ]
                    },
                    read_only: false
                  },
                  {
                    key: 'credit_check_proof',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Credit Check Proof',
                      max: 100,
                      label_photo: 'Take a photo',
                      label_upload: 'Choose a file',
                      type: 'picture'
                    },
                    read_only: false
                  },
                  {
                    key: 'credit_check_date',
                    type: 'datepicker',
                    templateOptions: {
                      required: false,
                      label: 'Approval date',
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
                    key: 'approved_credit_limit',
                    default: 0.0,
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Approved Credit Limit',
                      type: 'number'
                    },
                    read_only: false
                  },
                  {
                    key: 'terms_of_payment',
                    default: 'on_delivery',
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'Terms of Payment',
                      type: 'select',
                      options: [
                        {
                          value: 'prepaid',
                          label: 'Prepaid'
                        },
                        {
                          value: 'on_delivery',
                          label: 'Cash on delivery'
                        },
                        {
                          value: 'days',
                          label: 'Days'
                        },
                        {
                          value: 'days_eom',
                          label: 'Days after EOM'
                        },
                      ]
                    },
                    read_only: false
                  },
                  {
                    key: 'payment_due_date',
                    default: 0,
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Number of days to pay',
                      type: 'number',
                      min: 0,
                      description:
                        'Or set the day of the month within which the payment must be made to pay',
                      max: 32767
                    },
                    read_only: false
                  }
                ],
                width: 0.25
              },
              {
                label: 'Banking Detail',
                type: 'group',
                children: [
                  {
                    key: 'billing_email',
                    type: 'input',
                    templateOptions: {
                      required: false,
                      label: 'Billing E-mail',
                      max: 255,
                      type: 'email'
                    },
                    read_only: false
                  },
                  {
                    key: 'invoice_rule.id',
                    type: 'input',
                    hide: true,
                    templateOptions: {
                      required: false,
                      label: 'Id',
                      type: 'text'
                    },
                    read_only: true
                  },
                  {
                    key: 'invoice_rule.separation_rule',
                    default: 'one_invoce',
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'Separation rule',
                      type: 'select',
                      options: [
                        {
                          value: 'one_invoce',
                          label: 'One invoce'
                        },
                        {
                          value: 'per_jobsite',
                          label: 'Per jobsite'
                        },
                        {
                          value: 'per_candidate',
                          label: 'Per candidate'
                        }
                      ]
                    },
                    read_only: false
                  },
                  {
                    key: 'invoice_rule.period',
                    default: 'weekly',
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'Invoice Frequency',
                      type: 'select',
                      options: [
                        {
                          value: 'weekly',
                          label: 'Weekly'
                        },
                        {
                          value: 'fortnightly',
                          label: 'Fortnightly'
                        },
                        {
                          value: 'monthly',
                          label: 'Monthly'
                        },
                        {
                          value: 'daily',
                          label: 'Daily'
                        }
                      ]
                    },
                    read_only: false
                  },
                  {
                    key: 'invoice_rule.period_zero_reference',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Period zero reference',
                      max: 2147483647,
                      type: 'text',
                      min: -2147483648
                    },
                    showIf: [
                      {
                        type: 'master'
                      }
                    ],
                    default: 1,
                    type: 'input'
                  },
                  {
                    key: 'invoice_rule.serial_number',
                    type: 'input',
                    showIf: [
                      {
                        type: 'master'
                      }
                    ],
                    templateOptions: {
                      required: false,
                      label: 'Serial number',
                      max: 20,
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
                    key: 'invoice_rule.starting_number',
                    read_only: false,
                    templateOptions: {
                      required: false,
                      label: 'Starting number',
                      max: 2147483647,
                      type: 'text',
                      min: -2147483648
                    },
                    showIf: [
                      {
                        type: 'master'
                      }
                    ],
                    default: 1,
                    type: 'input'
                  },
                  {
                    key: 'invoice_rule.notice',
                    type: 'input',
                    showIf: [
                      {
                        type: 'master'
                      }
                    ],
                    templateOptions: {
                      required: false,
                      label: 'Notice',
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    key: 'invoice_rule.comment',
                    type: 'input',
                    showIf: [
                      {
                        type: 'master'
                      }
                    ],
                    templateOptions: {
                      required: false,
                      label: 'Comment',
                      type: 'text'
                    },
                    read_only: false
                  },
                  {
                    key: 'invoice_rule.show_candidate_name',
                    default: false,
                    type: 'checkbox',
                    templateOptions: {
                      required: false,
                      label: 'Show Candidate name',
                      type: 'checkbox',
                      text: 'Show name'
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
                label: 'Timesheet',
                type: 'group',
                children: [
                  {
                    key: 'timesheet_approval_scheme',
                    default: 'PIN',
                    type: 'select',
                    templateOptions: {
                      required: false,
                      label: 'TimeSheet approval scheme',
                      type: 'select',
                      options: [
                        {
                          value: 'PIN',
                          label: 'PIN'
                        },
                        {
                          value: 'SIGNATURE',
                          label: 'Signature'
                        }
                      ]
                    },
                    read_only: false
                  }
                ],
                width: 0.25
              },
              {
                label: 'About Company',
                type: 'group',
                children: [
                  {
                    key: 'description',
                    type: 'textarea',
                    templateOptions: {
                      required: false,
                      label: 'Public description',
                      type: 'textarea'
                    },
                    read_only: false
                  }
                ],
                width: 0.75
              }
            ]
          }
        ]
      },
      {
        endpoint: '/ecore/api/v2/core/companyaddresses/',
        delay: true,
        templateOptions: {
          label: 'Company Address',
          type: 'list',
          add_label: 'Add',
          text: 'Company Address'
        },
        collapsed: false,
        prefilled: {
          company: '{id}'
        },
        type: 'list',
        query: {
          company: '{id}'
        },
        help: 'All addresses of the company'
      },
      {
        endpoint: '/ecore/api/v2/core/companycontactrelationships/',
        add_endpoint: '/ecore/api/v2/core/companycontacts/',
        templateOptions: {
          label: 'Client Contacts',
          type: 'list',
          add_label: 'Add',
          text: 'Client Contacts'
        },
        collapsed: false,
        prefilled: {
          company: '{id}'
        },
        type: 'list',
        query: {
          company: '{id}'
        }
      },
      {
        endpoint: '/ecore/api/v2/hr/jobsites/',
        templateOptions: {
          label: 'Jobsites',
          type: 'list',
          add_label: 'Add',
          text: 'Jobsites'
        },
        collapsed: false,
        prefilled: {
          regular_company: '{id}'
        },
        type: 'list',
        query: {
          company: '{id}'
        },
        help: 'Jobsites from the client company'
      },
      {
        endpoint: '/ecore/api/v2/pricing/pricelists/',
        metadata_query: {
          editable_type: 'company'
        },
        templateOptions: {
          label: 'Price list',
          type: 'list',
          add_label: 'Add',
          text: 'Price list'
        },
        collapsed: false,
        prefilled: {
          company: '{id}'
        },
        type: 'list',
        query: {
          company: '{id}'
        }
      },
      {
        name: 'States',
        type: 'group',
        children: [
          {
            key: 'timeline',
            type: 'timeline',
            query: {
              model: 'core.companyrel',
              object_id: '{regular_company_rel.id}'
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
              object_id: '{regular_company_rel.id}'
            },
            type: 'list',
            query: {
              object_id: '{regular_company_rel.id}'
            },
            help: 'Here you can see changes client company states'
          }
        ]
      },
      {
        endpoint: '/ecore/api/v2/core/invoices/',
        type: 'list',
        query: {
          customer_company: '{id}'
        },
        templateOptions: {
          label: 'Invoices',
          type: 'list',
          text: 'Invoices'
        },
        collapsed: false
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
    key: 'manager.contact',
    read_only: false,
    hide: true,
    templateOptions: {
      required: true,
      label: 'Contact',
      type: 'text'
    },
    send: false,
    type: 'input'
  },
  {
    key: 'type',
    read_only: false,
    templateOptions: {
      required: false,
      label: 'Company type',
      type: 'text',
      options: [
        {
          value: 'master',
          label: 'Master'
        },
        {
          value: 'regular',
          label: 'Regular'
        }
      ]
    },
    hide: true,
    default: 'regular',
    type: 'input'
  },
  {
    key: 'name',
    type: 'input',
    hide: true,
    templateOptions: {
      required: true,
      label: 'Company Name',
      type: 'text',
      max: 127
    },
    read_only: false
  },
  {
    key: 'logo',
    read_only: false,
    templateOptions: {
      required: false,
      label: 'Logo',
      max: 100,
      file: false,
      type: 'picture'
    },
    hide: true,
    default: 'company_pictures/default_picture.jpg',
    type: 'input'
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
    type: 'address',
    key: 'address',
    many: false
  },
  {
    key: 'name',
    type: 'input',
    hide: true,
    templateOptions: {
      required: true,
      label: 'Company Name',
      type: 'text',
      max: 127
    },
    read_only: false
  },
  {
    key: 'website',
    type: 'input',
    hide: true,
    templateOptions: {
      required: false,
      label: 'Website',
      max: 200,
      type: 'text'
    },
    read_only: false
  }
];

const formadd = [
  {
    key: 'name',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Company Name',
      max: 127,
      type: 'text'
    },
    read_only: false
  },
  {
    key: 'business_id',
    type: 'input',
    templateOptions: {
      required: true,
      label: 'Business Number',
      max: 31,
      type: 'text'
    },
    read_only: false
  }
];

export const metadata = {
  list,
  form,
  formadd
};
