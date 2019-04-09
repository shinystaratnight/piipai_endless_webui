import { Injectable } from '@angular/core';

import { CheckPermissionService } from '../../shared/services';

import { Form } from '../models/form.model';

export enum FormMode {
  View = 'view',
  Edit = 'edit'
}

@Injectable()
export class FormService {

  private forms: {
    [key: string]: Form
  };

  constructor(
    private permissionService: CheckPermissionService
  ) {
    this.forms = {};
  }

  public registerForm(endpoint: string, mode: string) {
    const allowMethods = this.permissionService.getAllowMethods(undefined, endpoint);
    const form = new Form(endpoint, mode, allowMethods);

    this.forms[form.id] = form;

    return form.id;
  }

  public removeForm(endpoint: string) {
    delete this.forms[endpoint];
  }

  public changeModeOfForm(formId: number, mode: string) {
    const form = this.getForm(formId);

    form.changeMode(mode);
  }

  public getAllowedMethods(formId: number): string[] {
    const form = this.getForm(formId);

    return form.allowMethods;
  }

  public getForm(formId: number): Form {
    return this.forms[formId];
  }

  public disableEditMode(formId: number) {
    const form = this.getForm(formId);

    form.hideEditButton = true;
  }

  public disableSaveButton(formId: number, disbable?: boolean) {
    // TODO: remove if statement
    if (formId) {
      const form = this.getForm(formId);

      form.disableSaveButton = disbable;
    }
  }
}
