import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ApiService,
  MessageType,
  ToastService,
  UserService,
} from '@webui/core';
import { Endpoints, FormElement } from '@webui/models';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'webui-change-email-dialog',
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeEmailDialogComponent extends FormElement {
  override readonly formGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    new_email: new FormControl('', [Validators.required, Validators.email]),
  });

  @ViewChild(DialogComponent) dialogComponent!: DialogComponent;

  constructor(
    private api: ApiService,
    private userService: UserService,
    private toast: ToastService
  ) {
    super();
  }

  onSubmit() {
    const contactId = this.userService.user?.data.contact.id;
    const endpoint = `${Endpoints.Contact}${contactId}/change_email/`;

    this.submitForm(() =>
      this.api.put(endpoint, this.formGroup.value)
    ).subscribe((response) => {
      if (response.status === 'success') {
        this.dialogComponent.close();
        this.toast.sendMessage(response.message, MessageType.Info);
      }
    });
  }
}
