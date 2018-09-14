export const metadata = {
  list: {
    editDisable: true,
    columns: [
      {
        content: [
          {
            field: 'type',
            type: 'select',
            values: {
              sms: 'SMS',
              subscription: 'Subscription',
              extra_workers: 'Extra Workers',
            },
          }
        ],
        name: 'type',
        label: 'Type'
      },
      {
        content: [
          {
            field: 'amount',
            type: 'text',
            display: '${field}',
          }
        ],
        name: 'amount',
        label: 'Amount'
      },
      {
        content: [
          {
            field: 'status',
            type: 'select',
            values: {
              paid: 'Paid',
              not_paid: 'Not paid',
            },
          }
        ],
        name: 'type',
        label: 'Status'
      },
      {
        name: 'created',
        content: [
          {
            type: 'datepicker',
            field: 'created'
          },
        ],
        label: 'Created',
      },
      {
        content: [
          {
            field: 'invoice_url',
            type: 'text'
          }
        ],
        name: 'invoice_url',
        label: 'Invoice url'
      },
    ]
  },
  fields: [
    {
      type: 'datepicker',
      key: 'created',
      templateOptions: {
        type: 'datetime'
      }
    },
  ]
};

export const smsMetadata = [
  {
    endpoint: '/ecore/api/v2/sms-interface/smslogs/',
    templateOptions: {
      type: 'list',
    },
    type: 'list',
  },
];
