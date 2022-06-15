import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  ModalDismissReasons,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Icon, IconSize } from '@webui/icon';

@Component({
  selector: 'webui-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  @Input() public title?: string;
  public Icon = Icon;
  public IconSize = IconSize;

  constructor(private active: NgbActiveModal) {}

  public dismiss() {
    this.active.dismiss(ModalDismissReasons.ESC);
  }

  public close(result?: unknown) {
    return this.active.close(result);
  }
}
