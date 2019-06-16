const form = [
  {
    children: [
      {
        key: 'supervisor',
        type: 'static',
        templateOptions: {
          type: 'static',
          required: false,
          label: 'Supervisor'
        },
        read_only: true
      },
      {
        key: 'company',
        type: 'static',
        templateOptions: { type: 'static', required: false, label: 'Company' },
        read_only: true
      },
      {
        key: 'jobsite',
        type: 'static',
        templateOptions: { type: 'static', required: false, label: 'Jobsite' },
        read_only: true
      },
      {
        key: 'position',
        type: 'static',
        templateOptions: { type: 'static', required: false, label: 'Position' },
        read_only: true,
      },
    ],
    type: 'row'
  },
  {
    type: 'row',
    hideBorder: true,
    children: [
      {
        type: 'group',
        label: 'Times',
        children: [
          {
            width: 0.25,
            type: 'checkbox',
            key: 'noBreak',
            default: false,
            send: false,
            setNull: ['break_started_at', 'break_ended_at'],
            templateOptions: {
              label: 'No Break',
            },
          },
        ]
      }
    ]
  },
  {
    children: [
      {
        key: 'shift_started_at',
        type: 'datepicker',
        templateOptions: {
          type: 'datetime',
          required: false,
          label: 'Shift Start'
        },
        read_only: false
      },
      {
        // type: 'group',
        // hideLabel: true,
        // children: [
        //   {
            key: 'break_started_at',
            type: 'datepicker',
            templateOptions: {
              type: 'datetime',
              required: false,
              label: 'Break Start'
            },
            saveField: true,
            read_only: false,
            showIf: [{ noBreak: false }]
        //   },
        // ]
      },
      {
        // type: 'group',
        // hideLabel: true,
        // children: [
          // {
            key: 'break_ended_at',
            type: 'datepicker',
            templateOptions: {
              type: 'datetime',
              required: false,
              label: 'Break End'
            },
            saveField: true,
            read_only: false,
            showIf: [{ noBreak: false }],
          // },
      //   ]
      },
      {
        key: 'shift_ended_at',
        type: 'datepicker',
        templateOptions: {
          type: 'datetime',
          required: false,
          label: 'Shift End'
        },
        read_only: false
      },
    ],
    hideBorder: true,
    type: 'row'
  },
  {
    type: 'row',
    children: [
      {
        type: 'static',
        key: 'total_time',
        send: false,
        read_only: true,
        templateOptions: {
          label: 'Total time',
          color: 'text-success',
          inline: true
        }
      },
    ]
  }
];

export const metadata = {
  form,
  list: {}
};
