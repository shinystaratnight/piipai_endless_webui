export const meta = [
  {
    name: 'Company Settings',
    type: 'collapse',
    children: [
      {
        type: 'picture',
        key: 'company_settings.logo',
        read_only: false,
        templateOptions: {
          label: 'Logo',
          label_upload: 'Choose a file',
          label_photo: 'Take a photo',
          type: 'file',
          required: false,
          file: true,
          photo: false
        }
      },
      {
        type: 'radio',
        key: 'company_settings.font',
        label: true,
        default: 'Roboto',
        templateOptions: {
          label: 'Font',
          type: 'text',
          options: [
            { key: 'Roboto', value: 'Roboto' },
            { key: 'Lato', value: 'Lato' },
            { key: 'Barlow', value: 'Barlow' },
            { key: 'Open Sans', value: 'Open Sans' }
          ]
        }
      },
      {
        type: 'radio',
        key: 'company_settings.color_scheme',
        default: 'default',
        label: true,
        templateOptions: {
          label: 'Color scheme',
          type: 'color',
          inline: true,
          options: [
            { key: 'default', value: '#3cb1db' },
            { key: 'labour', value: '#f58926' },
            { key: 'indigo', value: '#3f51b5' },
            { key: 'teal', value: '#009688' },
            { key: 'brown', value: '#795548' }
          ]
        }
      },
      {
        type: 'input',
        key: 'company_settings.forwarding_number',
        templateOptions: {
          max: 32,
          label: 'Forwarding number',
          type: 'text',
        }
      }
    ]
  },
  {
    name: 'Payslip Rule',
    type: 'collapse',
    children: [
      {
        type: 'select',
        key: 'payslip_rule.period',
        read_only: false,
        templateOptions: {
          label: 'Period',
          required: true,
          options: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'fortnightly', label: 'Fortnightly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'daily', label: 'Daily' },
          ]
        }
      }
    ]
  },
  {
    name: 'Invoice Rule',
    type: 'collapse',
    children: [
      {
        type: 'select',
        key: 'invoice_rule.period',
        read_only: false,
        templateOptions: {
          label: 'Period',
          required: true,
          options: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'fortnightly', label: 'Fortnightly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'daily', label: 'Daily' },
          ]
        }
      },
      {
        type: 'select',
        key: 'invoice_rule.separation_rule',
        read_only: false,
        templateOptions: {
          label: 'Separation rule',
          required: true,
          options: [
            { value: 'one_invoce', label: 'One invoce' },
            { value: 'per_jobsite', label: 'Per jobsite' },
            { value: 'per_candidate', label: 'Per candidate' }
          ]
        }
      },
      {
        type: 'checkbox',
        key: 'invoice_rule.show_candidate_name',
        default: false,
        templateOptions: {
          label: 'Show candidate name',
        }
      }
    ]
  }
];
