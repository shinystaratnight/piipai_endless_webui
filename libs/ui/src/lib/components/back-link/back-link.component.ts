import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';

import { isClient, isCandidate, isManager } from '@webui/utilities';

@Component({
  selector: 'app-back-link',
  templateUrl: './back-link.component.html',
  styleUrls: ['./back-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BackLinkComponent implements OnInit {

  public urlPrefix = isClient() ? '/cl' : isCandidate() ? '/cd' : isManager ? '/mn' : '';

  @Input() label: string;
  @Input() path: string;
  @Input() key: string;

  translationKey: string;

  @Output() backEvent: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
    this.translationKey = `${this.key}`;
  }

  back(event: MouseEvent) {
    event.preventDefault();

    this.backEvent.emit(true);
    return false;
  }
}