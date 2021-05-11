import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { GenericFormService } from '../../services';

import { Modal, Status } from '../modal/modal.component';

export type EvaluateModalConfig = {
  signature?: boolean;
  evaluate?: boolean;
  label: {
    picture?: string;
    contactAvatar: string;
    name: string;
  };
  endpoint: string;
};

@Component({
  selector: 'app-evaluate-modal',
  templateUrl: './evaluate-modal.component.html',
  styleUrls: ['./evaluate-modal.component.scss']
})
export class EvaluateModalComponent extends Modal {
  config: EvaluateModalComponent;
  saveProcess: boolean;
  approveEndpoint: string;

  constructor(
    modal: NgbActiveModal,
    private genericFormService: GenericFormService
  ) {
    super(modal);
  }

  public formEvent(e) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }

    if (e.type === 'sendForm' && e.status === 'success') {
      if (this.approveEndpoint) {
        this.genericFormService
          .editForm(this.approveEndpoint, {})
          .subscribe(() => {
            this.close(Status.Success);
            this.approveEndpoint = null;
          });
      } else {
        this.close(Status.Success);
      }
    }
  }

  public sendEvaluateData(endpoint, data) {
    this.saveProcess = true;

    this.genericFormService
      .editForm(endpoint, data)
      .pipe(finalize(() => (this.saveProcess = false)))
      .subscribe(() => {
        this.formEvent({
          type: 'sendForm',
          status: 'success'
        });
      });
  }
}
