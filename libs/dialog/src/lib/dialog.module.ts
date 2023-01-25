import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogComponent,
  ChangePhoneNumberDialogComponent,
  ChangeEmailDialogComponent,
  ChangePasswordDialogComponent,
  ConfirmDialogComponent,
} from './components';
import {
  ModalDismissReasons,
  NgbModalModule,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from './services';
import { IconModule } from '@webui/icon';
import { FormControlsModule } from '@webui/form-controls';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@webui/ui';

export type DialogRef = NgbModalRef;
export type DialogDismissReason = ModalDismissReasons;
@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    IconModule,
    TranslateModule,
    ReactiveFormsModule,
    FormControlsModule,
    UiModule
  ],
  declarations: [
    DialogComponent,
    ChangePhoneNumberDialogComponent,
    ChangeEmailDialogComponent,
    ChangePasswordDialogComponent,
    ConfirmDialogComponent,
  ],
  providers: [DialogService],
  exports: [DialogComponent],
})
export class DialogModule {}
