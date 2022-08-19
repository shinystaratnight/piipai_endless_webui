import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Timesheet, TimesheetModel } from '@webui/data';
import { Endpoints } from '@webui/models';
import { isMobile } from '@webui/utilities';
import { Subject } from 'rxjs';
import { Modal, Status } from '../modal/modal.component';

type ClientTimesheetModalConfig = {
  endpoint: Endpoints;
  evaluateEvent(e: any, closeModal: () => any): any;
  sendSignature(submitButton?: any): any;

  changeEndpoint: string;
  evaluateEndpoint: string;
  edit: boolean;
  evaluated: boolean;
  total(data: any): any;
  metadataQuery: string;
  signatureStep: boolean;
  form: any;
  supervisor_signature: string;
  label: {
    avatar: { origin: string; thumb: string };
    fullName: string;
  };
  extendData: any;
  timesheetData: any;
  changeMetadata: Subject<any>;
  data: {
    evaluation_score: string;
  };
  signature: {
    endpoint: string;
    value: string;
  };
  timesheet: any;
};

@Component({
  selector: 'webui-change-timesheet-modal',
  templateUrl: './change-timesheet-modal.component.html',
  styleUrls: ['./change-timesheet-modal.component.scss'],
})
export class ChangeTimesheetModalComponent extends Modal implements OnInit {
  config!: ClientTimesheetModalConfig;
  saveProcess?: boolean;

  timesheet!: Timesheet;
  model!: TimesheetModel;

  isSignatureStep?: boolean;
  isMobile = isMobile;

  constructor(modal: NgbActiveModal) {
    super(modal);
  }

  get shiftDate() {
    return this.config.extendData.shift.date.__str__;
  }

  ngOnInit() {
    this.model = new TimesheetModel(this.timesheet);
    this.isSignatureStep = this.config.signatureStep;
  }

  public formEvent(e: any) {
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
