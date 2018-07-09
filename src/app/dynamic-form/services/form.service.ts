import { Injectable } from '@angular/core';

import { CheckPermissionService } from '../../shared/services';

import { Form } from '../models/form.model';

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
}
