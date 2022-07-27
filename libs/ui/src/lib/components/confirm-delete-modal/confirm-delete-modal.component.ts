import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { DialogComponent } from '@webui/dialog';

@Component({
  selector: 'webui-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDeleteModalComponent {
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
