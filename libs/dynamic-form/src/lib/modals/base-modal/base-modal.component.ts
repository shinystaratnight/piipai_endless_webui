import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseModalComponent {
  @Input() modalName: string;

  @Output() dissmisEvent: EventEmitter<void> = new EventEmitter();

  dismiss() {
    this.dissmisEvent.emit()
  }
}
