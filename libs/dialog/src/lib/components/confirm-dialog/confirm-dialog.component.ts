import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'webui-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
    instanceName?: string;

  @ViewChild(DialogComponent) dialogComponent!: DialogComponent;

  get param() {
    return {
      name: this.instanceName
    }
  }

  public onDismiss() {
    this.dialogComponent.dismiss();
  }

  public onDelete() {
    this.dialogComponent.close();
  }
}
