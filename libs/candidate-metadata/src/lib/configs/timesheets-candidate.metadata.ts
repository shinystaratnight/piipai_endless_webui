import { Color, Endpoints } from '@webui/data';
import { createFilter, Type } from '@webui/metadata';

const statusList = [
  { label: 'Pending submission', value: '4' },
  { label: 'Pending approval', value: '5' },
  { label: 'Approved', value: '7' }
];

const filters = {
  shift_started_at: createFilter(Type.Date, {
    key: 'shift_started_at',
    label: 'Shift date',
    yesterday: true,
    today: true,
    tomorrow: true
  }),
  status: createFilter(Type.Select, {
    key: 'status',
    label: 'Status',
    values: statusList
  }),
}

const list = {
  list: {
    list: 'timesheet',
    search_enabled: false,
    buttons: [],
    columns: [
      {
        label: 'Position / Jobsite',
        name: 'jobsite',
        sort: true,
        sort_field: 'jobsite',
        content: [
          {
            type: 'static',
            field: 'position',
            styles: ['bolder']
          },
          {
            endpoint: '/hr/jobsites/',
            type: 'related',
            label: 'Jobsite',
            field: 'jobsite',
            styles: ['secondary']
          },
        ]
      },
      {
        content: [
          {
            title: 'Show traking map',
            type: 'button',
            color: 'link',
            endpoint: `${Endpoints.CandidateLocation}{job_offer.candidate_contact.id}/history/`,
            field: 'id',
            action: 'showTracking',
            customLink: true,
            image: '/assets/img/map-lg.jpg'
          },
        ],
        name: 'tracking',
        center: true,
        title: null,
        label: 'Tracking',
        delim: null
      },
      {
        label: 'Times',
        delim: null,
        name: 'times',
        title: null,
        content: [
          {
            text: '{shift_started_at__date}',
            type: 'static',
            label: 'Date',
            field: 'shift_started_at'
          },
          {
            text: '{shift_started_at__time}',
            type: 'static',
            label: 'Start',
            field: 'shift_started_at'
          },
          {
            text: '-',
            type: 'static',
            label: 'Break',
            field: 'break_started_at',
            showIf: [{ status: [0, 1, 2, 3, 4] }]
          },
          {
            text: '-',
            type: 'static',
            label: 'End',
            field: 'shift_ended_at',
            showIf: [{ status: [0, 1, 2, 3, 4] }]
          },
          {
            text: '{break_started_at__time} - {break_ended_at__time}',
            type: 'static',
            label: 'Break',
            field: 'break_started_at',
            showIf: [{ status: [5, 6, 7] }]
          },
          {
            text: '{shift_ended_at__time}',
            type: 'static',
            label: 'End',
            field: 'shift_ended_at',
            showIf: [{ status: [5, 6, 7] }]
          }
        ]
      },
      {
        label: 'Times',
        delim: null,
        name: 'mobileTimes',
        title: null,
        hide: true,
        content: [
          {
            text: '{shift_started_at__date}',
            type: 'static',
            label: 'Shift date',
            field: 'shift_started_at'
          },
          {
            text: '{shift_started_at__time} / -',
            type: 'static',
            label: 'Shift start/end',
            field: 'shift_started_at',
            showIf: [{ status: [0, 1, 2, 3, 4] }]
          },
          {
            text: '- / -',
            type: 'static',
            label: 'Break start/end',
            field: 'break_started_at',
            showIf: [{ status: [0, 1, 2, 3, 4] }]
          },
          {
            text: '{shift_started_at__time} / {shift_ended_at__time}',
            type: 'static',
            label: 'Shift start/end',
            field: 'shift_ended_at',
            showIf: [{ status: [5, 6, 7] }]
          },
          {
            text: '{break_started_at__time} / {break_ended_at__time}',
            type: 'static',
            label: 'Break start/end',
            field: 'break_started_at',
            showIf: [{ status: [5, 6, 7] }]
          },
        ]
      },
      {
        label: 'Total time',
        name: 'totalTime',
        content: [
          {
            type: 'static',
            text: '{totalTime}',
            field: 'totalTime',
            styles: ['success'],
            showIf: [
              { status: [5, 6, 7] },
            ]
          },
          {
            field: 'status',
            type: 'static',
            text: 'Not started yet',
            styles: ['muted'],
            showIf: [{ status: [0, 1] }]
          },
          {
            field: 'status',
            type: 'static',
            text: 'Waiting for the timesheet',
            styles: ['muted'],
            showIf: [{ status: 2 }]
          },
          {
            field: 'status',
            type: 'static',
            text: 'No record',
            styles: ['muted'],
            showIf: [{ status: [3, 4] }]
          },
        ]
      },
      {
        label: 'Status',
        name: 'status',
        content: [
          {
            type: 'select',
            field: 'status',
            values: {
              0: 'New',
              1: 'Pre-Shift check pending',
              2: 'Pre-Shift check confirmed',
              3: 'Pre-Shift check failed',
              4: 'Submit pending',
              5: 'Approval pending',
              6: 'Supervisor modified',
              7: 'Approved',
            },
            color: {
              0: Color.Primary,
              1: Color.Primary,
              2: Color.Success,
              3: Color.Danger,
              4: Color.Primary,
              5: Color.Primary,
              6: Color.Danger,
              7: Color.Success,
            }
          },
          {
            field: 'status',
            type: 'static',
            text: 'Your shift is schedulled to start at {shift_started_at__time}',
            styles: ['muted'],
            showIf: [{
              status: 0
            }]
          },
          {
            field: 'status',
            type: 'static',
            text: 'Confirm if you are going to work',
            styles: ['muted'],
            showIf: [{
              status: 1
            }]
          },
          {
            text: 'Accept',
            type: 'button',
            endpoint: `${Endpoints.Timesheet}{id}/confirm/`,
            field: 'id',
            action: 'emptyPost',
            noDelim: true,
            styles: ['success', 'shadow', 'shadow-success', 'size-m', 'mr', 'resize'],
            showIf: [{
              status: 1
            }]
          },
          {
            text: 'Decline',
            type: 'button',
            endpoint: `${Endpoints.Timesheet}{id}/decline/`,
            field: 'id',
            action: 'emptyPost',
            styles: ['danger', 'shadow', 'shadow-danger', 'size-m'],
            showIf: [{
              status: 1
            }]
          },
          {
            field: 'status',
            type: 'static',
            text: 'Your shift will start {shift_started_at__diff}',
            styles: ['muted'],
            showIf: [{
              status: 2
            }]
          },
          {
            field: 'status',
            type: 'static',
            text: 'Inactive timesheet will be deleted in 48 hours',
            styles: ['muted'],
            showIf: [{
              status: 3
            }]
          },
          {
            text: 'Submit',
            type: 'button',
            endpoint: '/hr/timesheets-candidate/{id}/submit/',
            field: 'id',
            action: 'submitTimesheet',
            styles: ['success', 'shadow', 'shadow-success', 'size-l'],
            showIf: [{
              status: 4
            }]
          },
          {
            text: 'Edit submission',
            type: 'button',
            endpoint: '/hr/timesheets-candidate/{id}/submit/',
            field: 'id',
            action: 'submitTimesheet',
            styles: ['size-l', 'default'],
            showIf: [{
              status: 5
            }]
          },
          {
            field: 'status',
            type: 'static',
            text: 'Timesheet will be automatically approved in 4 hours',
            styles: ['muted'],
            showIf: [{
              status: 6
            }]
          },
          {
            field: 'supervisor.name',
            type: 'static',
            showIf: [{
              status: 7
            }]
          },
          {
            text: '{supervisor_approved_at__datetime}',
            field: 'supervisor_approved_at',
            type: 'static',
            styles: ['muted'],
            showIf: [
              { status: 7 },
              'supervisor_approved_at'
            ]
          },
          {
            text: '{supervisor_modified_at__datetime}',
            field: 'supervisor_modified_at',
            type: 'static',
            styles: ['muted'],
            showIf: [
              { status: 7 },
              'supervisor_modified_at'
            ]
          },
          {
            field: 'supervisor_signature',
            type: 'picture',
            file: false,
            signature: true,
            showId: ['supervisor_signature.origin'],
            showIf: [{
              status: 7
            }]
          },
        ]
      }
    ],
    filters: [
      filters.shift_started_at,
      filters.status
    ],
    editDisable: true,
    label: 'Timesheet history'
  },
  fields: [
    {
      key: 'id',
      type: 'button',
      templateOptions: {
        text: 'Submit',
        label: '',
        action: 'changeTimesheet',
        type: 'button'
      },
      read_only: true
    },
    {
      key: 'supervisor_approved_at',
      type: 'datepicker',
      templateOptions: {
        type: 'datetime',
        required: false,
        label: 'Supervisor Approved at'
      },
      read_only: true
    },
    {
      list: false,
      showIf: ['supervisor_approved'],
      many: false,
      collapsed: false,
      read_only: true,
      key: 'supervisor',
      endpoint: '/core/companycontacts/',
      type: 'related',
      templateOptions: {
        edit: true,
        label: 'Supervisor',
        add: true,
        type: 'related',
        delete: false,
        values: ['__str__']
      }
    },
    {
      key: 'going_to_work_confirmation',
      type: 'checkbox',
      templateOptions: {
        type: 'icon',
        required: false,
        label: 'Going to work',
        values: {
          false: 'times-circle',
          true: 'check-circle',
          null: 'minus-circle'
        }
      },
      read_only: true
    },
    {
      key: 'shift_ended_at',
      default: '2018-07-04T15:30:00+10:00',
      type: 'static',
      templateOptions: {
        text: '{shift_ended_at__time}',
        required: false,
        type: 'static',
        label: 'Shift ended at'
      },
      read_only: true
    },
    {
      list: false,
      many: false,
      collapsed: false,
      read_only: true,
      key: 'jobsite',
      endpoint: '/hr/jobsites/',
      type: 'related',
      templateOptions: {
        edit: true,
        label: 'Jobsite',
        add: true,
        type: 'related',
        delete: false,
        values: ['__str__']
      }
    },
    {
      key: 'shift_started_at',
      type: 'static',
      templateOptions: {
        text: '{shift_started_at__date}',
        required: false,
        type: 'static',
        label: 'Shift date'
      },
      read_only: true
    },
    {
      key: 'break_started_at',
      default: '2018-07-04T12:00:00+10:00',
      type: 'static',
      templateOptions: {
        text: '{break_started_at__time} - {break_ended_at__time}',
        required: false,
        type: 'static',
        label: 'Break'
      },
      read_only: true
    },
    {
      type: 'select',
      key: 'status',
      read_only: true,
      templateOptions: {
        label: 'Status',
        options: [
          { value: 0, label: 'New', color: Color.Success },
          { value: 1, label: 'Check pending', color: Color.Warning },
          { value: 2, label: 'Check confirmed', color: Color.Success },
          { value: 3, label: 'Check failed', color: Color.Danger },
          { value: 4, label: 'Submit pending', color: Color.Warning },
          { value: 5, label: 'Pending approval', color: Color.Success },
          { value: 6, label: 'Supervisor modified', color: Color.Success },
          { value: 7, label: 'Approved', color: Color.Success }
        ],
      }
    },
  ]
};

export const metadataTimesheetsCandidate = {
  list
};
