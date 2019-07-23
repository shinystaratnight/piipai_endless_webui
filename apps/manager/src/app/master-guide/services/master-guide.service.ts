import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Endpoints } from '../../metadata/helpers';
import { ErrorsService } from '../../shared/services';

@Injectable()
export class MasterGuideService {
  private endpoint = `${Endpoints.Company}guide/`;

  constructor(
    private http: HttpClient,
    private errors: ErrorsService
  ) {}

  getGuide() {
    return this.http.get(this.endpoint)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  updateValue(endpoint: string, data: any) {
    return this.http.patch(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      )
  }
}
