import { createFormElement, FormElementType } from '@webui/metadata';

export const workflowEl = createFormElement(FormElementType.Select, 'workflow', 'Workflow');

export const config = [
  {
    type: 'row',
    children: [
      {
        type: 'group',
        label: 'Workflow settings',
        children: [ workflowEl ]
      },
      {
        type: 'group',
        children: [
          {
            type: 'checkbox',
            key: 'advance_state_saving',
            value: false,
            templateOptions: {
              label: 'Advanced state saving'
            }
          }
        ]
      }
    ]
  }
]
