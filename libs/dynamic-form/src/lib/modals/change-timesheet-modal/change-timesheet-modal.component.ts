import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormatterService } from "@webui/core";
import { Endpoints, Timesheet, TimesheetModel } from "@webui/data";
import { isMobile } from "@webui/utilities";
import { Subject } from "rxjs";
import { getOrientation } from "../../helpers";
import { Modal, Status } from "../modal/modal.component";

type ClientTimesheetModalConfig = {
  endpoint: Endpoints;
  evaluateEvent(e: any, closeModal: Function);
  sendSignature(submitButton: any);

  changeEndpoint: string;
  evaluateEndpoint: string;
  edit: boolean;
  evaluated: boolean;
  total(data: any);
  metadataQuery: string;
  signatureStep: boolean;
  form: any;
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
  };
  signature: {
    endpoint: string;
    value: string;
  };
  timesheet: any;
};

@Component({
  selector: 'app-change-timesheet-modal',
  templateUrl: './change-timesheet-modal.component.html',
})
export class ChangeTimesheetModalComponent extends Modal {
  config: ClientTimesheetModalConfig;
  saveProcess: boolean;

  timesheet: Timesheet;
  model: TimesheetModel;

  isSignatureStep: boolean;
  isMobile = isMobile;

  constructor(modal: NgbActiveModal, private formatter: FormatterService) {
    super(modal);
  }

  get shiftDate() {
    return this.config.extendData.shift.date.__str__;
  }

  ngOnInit() {
    this.model = new TimesheetModel(this.timesheet);
    this.isSignatureStep = this.config.signatureStep;
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
