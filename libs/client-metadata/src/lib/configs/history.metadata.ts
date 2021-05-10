import { Endpoints } from '@webui/data';
import { createFilter, List, Type } from '@webui/metadata';
import {
  getPictureColumn,
  getPositionColumn,
  getPersonalInfoColumn,
  getTrackingElement,
  getTimesColumn,
  getTotalTimeColumn,
  getEvaluateColumn,
  getApproveButton,
  getChangeButton
} from './utils';



const list = function() {
  return {
    list: new List.main.element('timesheet', 'Timesheet history')
      .setFilters([
        createFilter(Type.Date, {
          key: 'shift_started_at',
          label: 'Shift Started at',
          yesterday: true,
          today: true,
        }),
        createFilter(Type.Relared, {
          key: 'candidate',
          label: 'Candidate Contact',
          endpoint: `${Endpoints.CandidateSupervisor}?supervisor={session.data.contact.contact_id}`
        }),
        createFilter(Type.Relared, {
          key: 'jobsite',
          label: 'Jobsite',
          endpoint: `${Endpoints.Jobsite}?regular_company={session.data.contact.company_id}`
        }),
        createFilter(Type.Relared, {
          key: 'primary_contact',
          label: 'Primary Contact',
          endpoint: `${Endpoints.CompanyContact}?company={session.data.contact.company_id}`
        }),
      ])
      .disableEdit()
      .disableSearch()
      .removeCreateButton()
      .setColumns([
        getPictureColumn(),
        getPositionColumn(),
        getPersonalInfoColumn(),

        new List.column.element('tracking', 'Tracking')
          .setCenter()
          .setContent([
            getTrackingElement().setShowIfRule([{ status: [4, 5, 6, 7] }])
          ]),

        getTimesColumn(),
        getTotalTimeColumn(),
        getEvaluateColumn(),

        new List.column.element('approve', 'Approve')
          .setHide()
          .setContent([
            getApproveButton().setShowIfRule([{ supervisor_approved_at: null }])
          ]),

        new List.column.element('change', 'Change')
          .setHide()
          .setContent([
            getChangeButton().setShowIfRule([{ supervisor_approved_at: null }])
          ]),

        new List.column.element('status', 'Status')
          .setTimezone('time_zone')
          .setContent([
            new List.static.element('status').setHideValue(true),

            new List.static.element('supervisor_approved')
              .setDisplay('Approved')
              .changeColor('success', 'supervisor_approved')
              .setShowIfRule([{ status: 7 }]),

            new List.static.element('supervisor.name').setShowIfRule([
              { status: 7 }
            ]),

            new List.static.element('supervisor_approved_at')
              .setDisplay('{supervisor_approved_at__datetime}')
              .setStyles(['muted'])
              .setShowIfRule([
                { status: 7 },
                'supervisor_approved_at',
                { supervisor_modified_at: null }
              ]),

            new List.picture.element('supervisor_signature', false)
              .setSignature()
              .setShowIfRule([{ status: 7 }, 'supervisor_signature.origin']),

            new List.static.element('status')
              .setDisplay('Waiting submission')
              .changeColor('danger', 'status')
              .setShowIfRule([{ status: 4 }]),

            new List.static.element('status')
              .setDisplay('Adjustment in progress')
              .changeColor('primary', 'status')
              .setInfoText(
                'Timesheet will be automatically approved in 4 hours'
              )
              .setShowIfRule([{ status: 6 }]),

            new List.static.element('supervisor_modified_at')
              .setDisplay('{supervisor_modified_at__datetime}')
              .setStyles(['muted'])
              .setShowIfRule([{ status: 6 }, 'supervisor_modified_at']),

            getChangeButton().setShowIfRule([{ status: 6 }]),

            getApproveButton().setShowIfRule([{ status: 5 }]),

            getChangeButton().setShowIfRule([{ status: 5 }])
          ])
      ])
  };
};

export const history = {
  list,
  formset: list
};
