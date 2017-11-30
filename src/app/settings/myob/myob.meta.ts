export const meta = [
  {
    name: 'API Connection',
    type: 'collapse',
    children: [
      {
        type: 'input',
        key: 'key',
        templateOptions: {
          label: 'Developer Key',
          type: 'text'
        }
      },
      {
        type: 'input',
        key: 'secret',
        templateOptions: {
          label: 'Developer Secret',
          type: 'text'
        }
      },
      {
        type: 'button',
        templateOptions: {
          text: 'Connect',
          p: true,
          action: 'connect'
        }
      }
    ]
  }
];
