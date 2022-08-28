import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'webui-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseModalComponent {
  @Input() title = '';
  @Input() modalClass = '';

  @Output() dissmisEvent: EventEmitter<void> = new EventEmitter();

  dismiss() {
    this.dissmisEvent.emit()
  }
}
