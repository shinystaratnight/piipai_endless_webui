import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorsService } from '@webui/core';
import { MetadataService } from '@webui/metadata';

import { METADATA } from './metadata.service';

@Injectable()
export class GenericFormService {
  constructor(
    private http: HttpClient,
    private errors: ErrorsService,
    private metadataService: MetadataService,
    @Optional() @Inject(METADATA) private metadata: any
  ) {}

  get(endpoint, params = {}): Observable<any> {
    const options = {
      params: new HttpParams({ fromObject: params})
    };

    return this.http.get(endpoint, options)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public getByQuery(endpoint, query): Observable<any> {
    return this.http
      .get(`${endpoint}${query}`)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public getAll(endpoint): Observable<any> {
    return this.http
      .get(endpoint)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public getMetadata(endpoint: string, query = ''): Observable<any> {
    return this.metadataService.get(endpoint, query, this.metadata);
  }

  public submitForm(endpoint, data): Observable<any> {
    return this.http
      .post(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public editForm(endpoint, data): Observable<any> {
    return this.http
      .put(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public updateForm(endpoint, data): Observable<any> {
    return this.http
      .patch(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public callAction(endpoint, data): Observable<any> {
    return this.http
      .post(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public delete(endpoint, id, postfix?): Observable<any> {
    return this.http
      .delete(`${endpoint}${id}/` + (postfix ? `${postfix}/` : ''))
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public uploadFile(endpoint, data): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http
      .post(endpoint, data, { headers })
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }
}
