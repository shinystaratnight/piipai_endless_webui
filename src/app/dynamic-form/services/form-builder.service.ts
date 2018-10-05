import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { map, catchError } from 'rxjs/operators';

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
    return this.http
      .get(this.formEndpoint + id + '/render/')
      .pipe(
        map((res: any) => res.json()),
        catchError((error: any) => this.errorsService.parseErrors(error))
      );
  }

  public sendFormData(id: string, data: any) {
    return this.http
      .post(this.formEndpoint + id + '/submit/', data)
      .pipe(
        map((res: any) => res.json()),
        catchError((error: any) => this.errorsService.parseErrors(error))
      );
  }

  public parseAddress(data) {
    return this.http
      .post(this.parseAddressEndpoint, data)
      .pipe(
        map((res: any) => res.json()),
        catchError((error: any) => this.errorsService.parseErrors(error))
      );
  }
}
