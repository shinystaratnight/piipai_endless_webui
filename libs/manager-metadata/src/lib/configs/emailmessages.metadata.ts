import { List } from '@webui/metadata';
import { ColumnElement } from 'libs/metadata/src/lib/elements/list/column-element';
import { Endpoints } from '@webui/data';

const list = () => {
  return {
    list: new List.main.element('emailmessages', 'Email Message')
      .disableEdit()
      .disableSearch()
      .removeCreateButton()
      .setColumns([
        {
          content: [
            {
              field: 'id',
              type: 'button',
              title: '{id}',
              endpoint: `${Endpoints.EmailMessages}{id}`,
              messageType: 'sent',
              color: 'link',
              customLink: true,
              action: 'messageDetail',
            }
          ],
          name: 'id',
          label: 'ID',
        } as ColumnElement,
        new List.column.element('subject', 'Subject').setContent([new List.text.element('subject')]),
        new List.column.element('to_addresses', 'To').setContent([new List.text.element('to_addresses')]),
        new List.column.element('state', 'State').setContent([
          new List.select.element('state').setValues({
            CREATED: 'Created',
            ERROR: 'Error',
            WAIT: 'Waiting',
            SENDING: 'Sending',
            SENT: 'Sent'
          })
        ]),
        new List.column.element('created_at', 'Created At').setContent([
          new List.static.element('created_at').setDisplay('{created_at__datetime}')
        ])
      ])
  };
};

const sent = [
  {
    type: 'input',
    key: 'resend_id',
    hide: true,
    templateOptions: {
      type: 'text'
    }
  },
  {
    type: 'checkbox',
    key: 'has_resend_action',
    hide: true,
    templateOptions: {}
  },
  {
    type: 'row',
    className: 'col row',
    children: [
      {
        type: 'group',
        label: 'From',
        normal: true,
        children: [
          {
            key: 'from_email',
            read_only: true,
            type: 'static',
            templateOptions: {
              // bottom: true
            },
          }
        ]
      },
      {
        type: 'group',
        label: 'To',
        normal: true,
        children: [
          {
            key: 'to_addresses',
            read_only: true,
            type: 'static',
            templateOptions: {
              // bottom: true
            },
          }
        ]
      }
    ]
  },
  {
    key: 'subject',
    type: 'input',
    templateOptions: {
      label: 'Subject',
    },
  },
  {
    endpoint: Endpoints.EmailMessages,
    read_only: true,
    templateOptions: {
      label: 'Template',
      values: ['__str__'],
    },
    type: 'related',
    key: 'template',
  },
  {
    key: 'bodies',
    type: 'textarea',
    templateOptions: {
      label: 'Text of the message',
      type: 'textarea',
      background: true,
      array: true,
    },
  },
  {
    type: 'row',
    className: 'row col',
    children: [
      {
        key: 'state',
        type: 'select',
        templateOptions: {
          label: 'Status',
          errorDescription: {
            value: 'FAILED',
            error: 'The contact is not available in this moment'
          },
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
              label: 'Failed',
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
          ]
        },
      },
    ]
  },
  {
    key: 'created_at',
    type: 'datepicker',
    templateOptions: {
      label: 'Created at',
      type: 'datetime'
    },
  },
];

export const emailmessages = {
  list,
  sent
};
