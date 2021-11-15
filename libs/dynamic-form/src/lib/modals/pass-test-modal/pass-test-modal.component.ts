import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface PassTestModalConfig {
  send?: boolean;
  workflowObject?: string;
  testId?: string;
  description?: string;
  test?: any;
  skipScoreForTest?: boolean;
}

@Component({
  selector: 'app-pass-test-modal',
  templateUrl: './pass-test-modal.component.html',
  styleUrls: ['./pass-test-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassTestModalComponent {
  config: PassTestModalConfig;

  constructor(private modal: NgbActiveModal) {}

  close(data: any) {
    this.modal.close(data);
  }

  dismiss() {
    this.modal.dismiss();
  }
}
