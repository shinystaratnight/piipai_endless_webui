import { ApiMethod } from '@webui/data';
import { createFilter, List, Type } from '@webui/metadata';
import { Endpoints } from '@webui/models';

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
      .setFilters([
        createFilter(Type.Date, {
          key: 'shift_started_at',
          label: 'Shift Started at',
          yesterday: true,
          today: true
        }),
        createFilter(Type.Relared, {
          key: 'candidate',
          label: 'Candidate Contact',
          endpoint: `${Endpoints.CandidateSupervisor}?supervisor={session.data.contact.contact_id}`
        }),
        createFilter(Type.Relared, {
          key: 'position',
          label: 'Position',
          endpoint: Endpoints.Skill,
          multiple: false,
        })
      ])
      .disableEdit()
      .disableSearch()
      .removeCreateButton()
      .setActions({
        options: [
          {
            endpoint: `${Endpoints.Timesheet}{id}/approve/`,
            signature_endpoint: `${Endpoints.Timesheet}{id}/approve_by_signature/`,
            label: 'Approve',
            selectionError: 'Please select at least one timesheet!',
            confirm: false,
            property: 'id',
            required: true,
            multiple: true,
            method: ApiMethod.PUT,
            bodyFields: [
              'shift_started_at',
              'shift_ended_at',
              'break_started_at',
              'break_ended_at',
              { send_candidate_message: false },
              { send_supervisor_message: false },
              { no_break: false }
            ],
            bodySignature: {
              supervisor_signature: ''
            }
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
      ])
  };
};

export const unapproved = {
  list,
  formset: list
};
