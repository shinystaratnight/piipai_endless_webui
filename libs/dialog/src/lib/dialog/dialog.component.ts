import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Icon, IconSize } from '@webui/icon';

@Component({
  selector: 'webui-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {
  @Input() public title?: string;
  public Icon = Icon;
  public IconSize = IconSize;

  constructor(private active: NgbActiveModal) {}

  ngOnInit(): void {}

  public dismiss() {
    this.active.dismiss(ModalDismissReasons.ESC);
  }

  public close(result?: any) {
    return this.active.close(result);
  }
}
