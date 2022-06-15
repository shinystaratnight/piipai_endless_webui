import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Timesheet, TimesheetModel } from '@webui/data';
import { isMobile } from '@webui/utilities';
import { Modal, Status } from '../modal/modal.component';

export type ApproveTimesheetModalConfig = {
  evaluateEvent(e: any, closeModal: Function);
  sendSignature(submitButton?: any);

  endpoint: string;
  evaluateEndpoint: string;
  evaluated: boolean;
  timesheet: {
    date: string;
    started_at: string;
    break: string;
    ended_at: string;
    shift_start_end: string;
    break_start_and: string;
    unformated_date: string;
    total: string;
  };
  form: any;
  signature: {
    endpoint: string;
    value: string;
  };
  label: {
    avatar: { origin: string; thumb: string };
    fullName: string;
  };
  data: {
    evaluation_score: number;
  };
  signatureStep: boolean;
  approve: boolean;
};

@Component({
  selector: 'app-approve-timesheet-modal',
  templateUrl: './approve-timesheet-modal.component.html',
  styleUrls: ['./approve-timesheet-modal.component.scss'],
})
export class ApproveTimesheetModalComponent extends Modal implements OnInit {
  config: ApproveTimesheetModalConfig;
  saveProcess: boolean;

  timesheet: Timesheet;
  model: TimesheetModel;

  isMobile = isMobile;

  constructor(modal: NgbActiveModal) {
    super(modal);
  }

  ngOnInit() {
    this.model = new TimesheetModel(this.timesheet);
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

  public updateSignature(signature: string) {
    this.config.signature.value = signature;
  }
}
