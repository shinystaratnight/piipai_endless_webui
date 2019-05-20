import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-back-link',
  templateUrl: './back-link.component.html',
  styleUrls: ['./back-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BackLinkComponent {

  @Input() label: string;
  @Input() path: string;

  @Output() backEvent: EventEmitter<boolean> = new EventEmitter();

  back(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.backEvent.emit(true);
  }
}
