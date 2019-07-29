import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { ErrorsService } from '@webui/core';
import { MetadataService } from '@webui/metadata';
import { METADATA } from './metadata.service';

@Injectable()
export class GenericFormService {
  constructor(
    private http: HttpClient,
    private errors: ErrorsService,
    private configs: MetadataService,
    @Optional() @Inject(METADATA) private metadata: any
  ) {}

  get(endpoint, params = {}) {
    const options = {
      params: new HttpParams({ fromObject: params})
    };

    return this.http.get(endpoint, options);
  }

  public getByQuery(endpoint, query): any {
    return this.http
      .get(`${endpoint}${query}`)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public getAll(endpoint): any {
    return this.http
      .get(endpoint)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public getMetadata(endpoint: string, query = ''): any {
   return this.configs.get(endpoint, query, this.metadata);
  }

  public submitForm(endpoint, data): any {
    return this.http
      .post(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public editForm(endpoint, data): any {
    return this.http
      .put(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public updateForm(endpoint, data): any {
    return this.http
      .patch(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public callAction(endpoint, data): any {
    return this.http
      .post(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public delete(endpoint, id, postfix?): any {
    return this.http
      .delete(`${endpoint}${id}/` + (postfix ? `${postfix}/` : ''))
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }

  public uploadFile(endpoint, data) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http
      .post(endpoint, data, { headers })
      .pipe(
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }
}
