import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';

import { ErrorsService } from '../../shared/services/errors.service';

@Injectable()
export class FormBuilderService {

  public formEndpoint = '/core/forms/';
  public parseAddressEndpoint = '/core/addresses/parse/';

  constructor(
    private http: HttpClient,
    private errorsService: ErrorsService,
  ) { }

  public getRenderData(id: string) {
    return this.http
      .get(this.formEndpoint + id + '/render/')
      .pipe(
        catchError((error: any) => this.errorsService.parseErrors(error))
      );
  }

  public sendFormData(id: string, data: any) {
    return this.http
      .post(this.formEndpoint + id + '/submit/', data)
      .pipe(
        catchError((error: any) => this.errorsService.parseErrors(error))
      );
  }

  public parseAddress(data) {
    return this.http
      .post(this.parseAddressEndpoint, data)
      .pipe(
        catchError((error: any) => this.errorsService.parseErrors(error))
      );
  }
}
