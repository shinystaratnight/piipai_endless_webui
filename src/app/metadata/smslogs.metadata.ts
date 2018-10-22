import { yesterdayFormatDate, todayFormatDate, weekStart, weekEnd, monthStart, monthEnd } from './utils';

const formset = {
  list: {
    list: 'smslog',
    label: 'SMS log',
    columns: [
      {
        content: [
          {
            field: 'sent_at',
            type: 'datepicker'
          }
        ],
        name: 'sent_at',
        sort_field: 'sent_at',
        label: 'Sent at',
        sort: true
      },
      {
        content: [
          {
            field: 'sid',
            type: 'textarea'
          }
        ],
        name: 'sid',
        sort_field: 'sid',
        label: 'SID',
        sort: true
      },
      {
        content: [
          {
            field: 'type',
            type: 'select',
            values: {
              SENT: 'SMS sent',
              RECEIVED: 'SMS received'
            }
          }
        ],
        name: 'type',
        sort_field: 'type',
        label: 'Direction',
        sort: true
      },
      {
        content: [
          {
            field: 'from_number',
            type: 'input'
          }
        ],
        name: 'from_number',
        sort_field: 'from_number',
        label: 'From number',
        sort: true
      },
      {
        content: [
          {
            field: 'to_number',
            type: 'input'
          }
        ],
        name: 'to_number',
        sort_field: 'to_number',
        label: 'To number',
        sort: true
      },
      {
        content: [
          {
            field: 'segments',
            type: 'input'
          }
        ],
        name: 'segments',
        sort_field: 'segments',
        label: 'Number of segments',
        sort: true,
      },
      {
        content: [
          {
            values: {
              ACCEPTED: 'Accepted',
              SENT: 'Sent',
              QUEUED: 'Queued',
              SENDING: 'Sending',
              FAILED: 'Failed',
              DELIVERED: 'Delivered',
              UNDELIVERED: 'Undelivered',
              RECEIVED: 'Received'
            },
            field: 'status',
            type: 'select'
          }
        ],
        name: 'status',
        sort_field: 'status',
        label: 'Status',
        sort: true
      },
      {
        content: [
          {
            field: 'cost',
            display: '$ {field}',
            type: 'input'
          }
        ],
        name: 'cost',
        label: 'Cost',
      }
    ],
    pagination_label: 'SMS message',
    search_enabled: true,
    editDisable: true,
    buttons: [],
    filters: [
      {
        list: [
          {
            label: 'Today',
            query: `created_at_0=${todayFormatDate}&created_at_1=${todayFormatDate}`
          },
          {
            label: 'Yesterday',
            query: `created_at_0=${yesterdayFormatDate}&created_at_1=${yesterdayFormatDate}`
          },
          {
            label: 'This week',
            query: `created_at_0=${weekStart}&created_at_1=${weekEnd}`
          },
          {
            label: 'This month',
            query: `created_at_0=${monthStart}&created_at_1=${monthEnd}`
          },
        ],
        key: 'created_at',
        label: 'Created at',
        type: 'date',
        input: [
          {
            label: 'From',
            query: 'created_at_0'
          },
          {
            label: 'To',
            query: 'created_at_1'
          }
        ]
      },
      {
        key: 'status',
        label: 'Status',
        options: [
          {
            value: 'ACCEPTED',
            label: 'Accepted'
          },
          {
            value: 'SENT',
            label: 'Sent'
          },
          {
            value: 'QUEUED',
            label: 'Queued'
          },
          {
            value: 'SENDING',
            label: 'Sending'
          },
          {
            value: 'FAILED',
            label: 'Failed'
          },
          {
            value: 'DELIVERED',
            label: 'Delivered'
          },
          {
            value: 'UNDELIVERED',
            label: 'Undelivered'
          },
          {
            value: 'RECEIVED',
            label: 'Received'
          }
        ],
        query: 'status',
        default: null,
        type: 'select'
      },
      {
        key: 'type',
        label: 'Type',
        options: [
          {
            value: 'SENT',
            label: 'SMS sent'
          },
          {
            value: 'RECEIVED',
            label: 'SMS received'
          }
        ],
        query: 'type',
        multiple: false,
        default: null,
        type: 'checkbox'
      }
    ]
  },
  fields: []
};

export const metadata = {
  formset,
};
