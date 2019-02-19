export const autoChargeMetadata = [
  {
    key: 'auto_charge',
    default: true,
    type: 'checkbox',
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
    templateOptions: {
      required: true,
      label: 'If the balance falls below',
      type: 'number'
    },
    read_only: false
  },
  {
    key: 'top_up_amount',
    type: 'input',
    default: 20,
    templateOptions: {
      required: true,
      label: 'Charge the balance by',
      type: 'number'
    },
    read_only: false
  },
];
