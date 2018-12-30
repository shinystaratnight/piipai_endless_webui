import { BehaviorSubject } from 'rxjs';
const formData = new BehaviorSubject({ data: {} });

export const meta = [
  {
    type: 'row',
    children: [
      {
        type: 'group',
        label: 'Company Setting',
        children: [
          {
            type: 'input',
            key: 'company_settings.logo',
            read_only: false,
            companyContact: true,
            templateOptions: {
              label: 'Logo',
              label_upload: 'Choose a file',
              label_photo: 'Take a photo',
              type: 'picture',
              required: false,
              file: false
            }
          },
          {
            type: 'radio',
            key: 'company_settings.font',
            label: true,
            default: 'Source Sans Pro',
            templateOptions: {
              label: 'Font',
              type: 'text',
              options: [
                { key: 'Source Sans Pro', value: 'Source Sans Pro' },
                { key: 'Roboto', value: 'Roboto' },
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
                { key: 'default', value: '#28A3FC' },
                { key: 'labour', value: '#f58926' },
                { key: 'indigo', value: '#3f51b5' },
                { key: 'teal', value: '#009688' },
                { key: 'brown', value: '#795548' }
              ]
            }
          },
        ]
      },
      {
        type: 'group',
        children: [
          {
            type: 'input',
            key: 'company_settings.forwarding_number',
            templateOptions: {
              max: 32,
              label: 'Forwarding number',
              type: 'text',
            }
          },
          {
            type: 'input',
            key: 'company_settings.billing_email',
            templateOptions: {
              max: 32,
              label: 'Billing email',
              type: 'email',
            }
          },
          {
            key: 'company_settings.sms_enabled',
            type: 'checkbox',
            read_only: false,
            templateOptions: {
              label: 'SMS sending enabled',
              type: 'checkbox',
              description: 'Please deselect this checkbox if you want to disable sms sending from r3sourcer software',
              required: false
            }
          },
          {
            key: 'company_settings.pre_shift_sms_enabled',
            type: 'checkbox',
            formData,
            read_only: false,
            templateOptions: {
              label: 'Pre-Shift check enabled',
              type: 'checkbox',
              required: false
            }
          },
          {
            type: 'input',
            key: 'company_settings.pre_shift_sms_delta',
            formData,
            showIf: [{
              'company_settings.pre_shift_sms_enabled': true
            }],
            templateOptions: {
              max: 240,
              min: 1,
              label: 'Pre-Shift check SMS time interval (minutes)',
              type: 'number',
            }
          },
        ]
      }
    ]
  },
  {
    type: 'row',
    children: [
      {
        label: 'Payslip Rule',
        type: 'group',
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
        label: 'Invoice Rule',
        type: 'group',
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
    ]
  },
];
