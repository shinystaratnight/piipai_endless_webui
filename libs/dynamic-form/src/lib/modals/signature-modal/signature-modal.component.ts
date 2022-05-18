import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Modal, Status } from '../modal/modal.component';

@Component({
  selector: 'app-signature-modal',
  templateUrl: './signature-modal.component.html',
  styleUrls: ['./signature-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignatureModalComponent extends Modal {

  private signature: string = '';

  constructor(
    modal: NgbActiveModal
  ) {
    super(modal);
  }

  public updateSignature(signature: string): void {
    this.signature = signature;
  }

  public saveSignature(): void {
    this.close(Status.Success, this.signature);
  }
}
