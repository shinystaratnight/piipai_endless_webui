import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Endpoints } from '@webui/data';
import { isMobile } from '@webui/utilities';
import { Subject } from 'rxjs';
import { getOrientation } from '../../helpers';
import { Modal, Status } from '../modal/modal.component';

const mobileDesign = [
  Endpoints.TimesheetHistory,
  Endpoints.TimesheetCandidate,
  Endpoints.TimesheetUnapproved
];

export type ClientTimesheetModalConfig = {
  endpoint: Endpoints;
  evaluateEvent(e: any, closeModal: Function);
  updateSignature(e: any);
  sendSignature(submitButton: any);

  changeEndpoint: string;
  evaluateEndpoint: string;
  edit: boolean;
  evaluated: boolean;
  total(data: any);
  metadataQuery: string;
  signatureStep: boolean;
  form: any,
  supervisor_signature: string;
  label: {
    picture: string;
    contactAvatar(string);
    name: string;
  };
  extendData: any;
  timesheetData: any;
  changeMetadata: Subject<any>;
  data: {
    evaluation_score: string;
  },
  signature: {
    endpoint: string;
    value: ''
  },
  timesheet: any;
};

@Component({
  selector: 'app-client-timesheet-modal',
  templateUrl: './client-timesheet-modal.component.html'
})
export class ClientTimesheetModalComponent extends Modal {
  config: ClientTimesheetModalConfig;
  saveProcess: boolean;

  constructor(modal: NgbActiveModal) {
    super(modal);
  }

  public formEvent(e) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }

    if (e.type === 'sendForm' && e.status === 'success') {
      this.close(Status.Success);
    }
  }

  public errorEvent() {
    this.saveProcess = false;
  }

  public identifyDevice() {
    let changeDesign = false;

    mobileDesign.forEach((el) => {
      if (this.config.endpoint && this.config.endpoint.includes(el)) {
        changeDesign = true;
      }
    });

    if (changeDesign) {
      return isMobile();
    }
  }

  public landscape() {
    return isMobile() && getOrientation() === 90;
  }
}
