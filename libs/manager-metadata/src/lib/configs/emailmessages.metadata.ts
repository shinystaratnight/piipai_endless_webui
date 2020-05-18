import { List } from '@webui/metadata';

const list = () => {
  return {
    list: new List.main.element('emailmessages', 'Email Message')
      .disableEdit()
      .disableSearch()
      .removeCreateButton()
      .setColumns([
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

export const emailmessages = {
  list
};
