export const autoChargeMetadata = [
  {
    key: 'auto_charge',
    type: 'checkbox',
    value: undefined,
    templateOptions: {
      required: true,
      label: 'Enable',
      type: 'checkbox'
    },
    read_only: false
  },
  {
    key: 'top_up_limit',
    type: 'input',
    default: 10,
    value: undefined,
    templateOptions: {
      label: 'If the balance falls below',
      type: 'number',
    },
    read_only: false
  },
  {
    key: 'top_up_amount',
    type: 'input',
    default: 20,
    value: undefined,
    templateOptions: {
      label: 'Charge the balance by',
      type: 'number',
    },
    read_only: false
  },
];
