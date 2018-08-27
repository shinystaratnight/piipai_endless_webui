import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ErrorsService } from '../../shared/services/errors.service';

@Injectable()
export class FormBuilderService {

  public formEndpoint = '/ecore/api/v2/core/forms/';
  public parseAddressEndpoint = '/ecore/api/v2/core/addresses/parse/';

  constructor(
    private http: Http,
    private errorsService: ErrorsService,
  ) { }

  public getRenderData(id: string) {
    return this.http.get(this.formEndpoint + id + '/render/')
      .map((res: any) => res.json())
      .catch((error: any) => this.errorsService.parseErrors(error));
  }

  public sendFormData(id: string, data: any) {
    return this.http.post(this.formEndpoint + id + '/submit/', data)
      .map((res: any) => res.json())
      .catch((error: any) => this.errorsService.parseErrors(error));
  }

  public parseAddress(data) {
    return this.http.post(this.parseAddressEndpoint, data)
      .map((res: any) => res.json())
      .catch((error: any) => this.errorsService.parseErrors(error));
  }
}
