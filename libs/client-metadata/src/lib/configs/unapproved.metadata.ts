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

const changeButton = function() {
  return getChangeButton().setShowIfRule([{ supervisor_approved_at: null }]);
};

const list = function() {
  return {
    list: new List.main.element('timesheet', 'Unapproved timesheets')
      .disableEdit()
      .disableSearch()
      .removeCreateButton()
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
