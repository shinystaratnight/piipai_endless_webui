import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export enum Reason {
  Cancel
}

export enum Status {
  Success
}

export class Modal {
  modal: NgbActiveModal

  constructor(modal: NgbActiveModal) {
    this.modal = modal;
  }

  dismiss(reason?: Reason) {
    this.modal.dismiss(reason);
  }

  close(status?: Status, result?: any): void {
    this.modal.close({
      status,
      result
    });
  }
}
