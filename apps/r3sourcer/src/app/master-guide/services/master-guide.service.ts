import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Endpoints, Purpose, Page } from '@webui/data';
import {
  ErrorsService,
  CompanyPurposeService,
  SiteSettingsService
} from '@webui/core';

@Injectable()
export class MasterGuideService {
  private endpoint = `${Endpoints.Company}guide/`;

  constructor(
    private http: HttpClient,
    private errors: ErrorsService,
    private purpose: CompanyPurposeService,
    private settings: SiteSettingsService
  ) {}

  getGuide() {
    return this.http
      .get(this.endpoint)
      .pipe(catchError((error: any) => this.errors.parseErrors(error)));
  }

  changePurpose(id: string, purpose: Purpose) {
    return this.purpose.changePurpose(id, purpose);
  }

  updateValue(endpoint: string, data: any) {
    return this.http
      .put(endpoint, data)
      .pipe(catchError((error: any) => this.errors.parseErrors(error)));
  }
}
