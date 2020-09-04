import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseButtonComponent {
  @Input() sm: boolean;
  @Input() danger: boolean;
}
