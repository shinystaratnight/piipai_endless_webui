import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { ModalDismissReasons, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from './dialog.service';
import { IconModule } from '@webui/icon';

export type DialogRef = NgbModalRef;
export type DialogDismissReason = ModalDismissReasons;
@NgModule({
  imports: [CommonModule, NgbModalModule, IconModule],
  declarations: [DialogComponent],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {}
