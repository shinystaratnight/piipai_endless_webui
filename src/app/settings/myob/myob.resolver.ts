import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

@Injectable()
export class MyobResolver implements Resolve<any> {

  constructor(private service: GenericFormService) { }

  public resolve() {
    const url = `/ecore/api/v2/company_settings/myob_settings/`;
    return this.service.getAll(url);
  }
}
