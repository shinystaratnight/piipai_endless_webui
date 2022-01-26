import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteSettingsService } from '@webui/core';

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

  constructor(
    private modal: NgbActiveModal,
    private settings: SiteSettingsService
  ) {}

  public get logo(): string {
    return this.settings.settings.logo || '/assets/img/logo.svg';
  }

  close(data: any) {
    this.modal.close(data);
  }

  dismiss() {
    this.modal.dismiss();
  }
}
