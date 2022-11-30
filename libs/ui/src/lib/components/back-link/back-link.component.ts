import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'webui-back-link',
  templateUrl: './back-link.component.html',
  styleUrls: ['./back-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackLinkComponent {
  @Input() label?: string;
  @Input() path?: string;
  @Input() key = '';

  @Output() backEvent = new EventEmitter<boolean>();

  constructor(private location: Location) {}

  onClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.path ? this.location.back() : this.backEvent.emit(true);
  }
}
