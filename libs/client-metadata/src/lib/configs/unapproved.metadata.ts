import { Endpoints } from '@webui/data';
import { List } from '@webui/metadata';

import {
  getTrackingElement,
  getChangeButton,
  getApproveButton,
  getPictureColumn,
  getPositionColumn,
  getPersonalInfoColumn,
  getTimesColumn,
  getTotalTimeColumn,
  getEvaluateColumn
} from './utils';

const changeButton = function () {
  return getChangeButton().setShowIfRule([{ supervisor_approved_at: null }]);
};

const list = function () {
  return {
    list: new List.main.element('timesheet', 'Unapproved timesheets')
      .disableEdit()
      .disableSearch()
      .removeCreateButton()
      .setActions({
        options: [
          {
            endpoint: `${Endpoints.Timesheet}{id}/approve/`,
            label: 'Approve',
            selectionError: 'Please select at least one timesheet!',
            confirm: false,
            property: 'id',
            required: true,
            multiple: true,
            method: 'PUT',
            bodyFields: [
              'shift_started_at',
              'shift_ended_at',
              'break_started_at',
              'break_ended_at',
              { send_candidate_message: false },
              { send_supervisor_message: false },
              { no_break: false }
            ]
          }
        ],
        label: 'Actions',
        agree_label: 'Agree',
        button_label: 'Go',
        decline_label: 'Decline'
      })
      .setColumns([
        getPictureColumn(),
        getPositionColumn(),
        getPersonalInfoColumn(),

        new List.column.element('tracking', 'Tracking')
          .setCenter()
          .setContent([getTrackingElement()]),

        getTimesColumn(),
        getTotalTimeColumn(),
        getEvaluateColumn(),

        new List.column.element('approve', 'Approve/Change').setContent([
          getApproveButton()
            .setShowIfRule([{ supervisor_approved_at: null }])
            .addReplaceBy('supervisor'),

          changeButton()
        ]),

        new List.column.element('change', 'Change')
          .setHide()
          .setContent([changeButton()]),

        new List.column.element('traking', 'Tracking')
          .setHide()
          .setContent([getTrackingElement()])
      ])
  };
};

export const unapproved = {
  list,
  formset: list
};
