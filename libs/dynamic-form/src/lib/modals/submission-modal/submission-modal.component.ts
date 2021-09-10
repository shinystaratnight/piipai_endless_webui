import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Modal, Status } from '../modal/modal.component';

@Component({
  selector: 'app-submission-modal',
  templateUrl: './submission-modal.component.html',
  styleUrls: ['./submission-modal.component.scss']
})
export class SubmissionModalComponent extends Modal {
  config: any;

  constructor(public modal: NgbActiveModal) {
    super(modal);
  }

  dismiss() {
    this.modal.dismiss();
  }

  onFormEvent(e) {
    if (e.type === 'sendForm' && e.status === 'success') {
      this.close(Status.Success);
    }
  }
}
