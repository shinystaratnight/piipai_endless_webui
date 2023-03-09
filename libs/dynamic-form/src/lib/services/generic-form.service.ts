import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorsService, ParseErrorOptions } from '@webui/core';
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

  get(endpoint: string, params = {}): Observable<any> {
    const options = {
      params: new HttpParams({ fromObject: params})
    };

    return this.http.get(endpoint, options)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public getByQuery(endpoint: string, query: string): Observable<any> {
    return this.http
      .get(`${endpoint}${query}`)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public getAll(endpoint: string): Observable<any> {
    return this.http
      .get(endpoint)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public getMetadata(endpoint: string, query = ''): Observable<any> | undefined {
    return this.metadataService.get(endpoint, query, this.metadata);
  }

  public submitForm(endpoint :string, data: any, options?: ParseErrorOptions): Observable<any> {
    return this.http
      .post(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.handleError(error, options))
      );
  }

  public editForm(endpoint: string, data: any): Observable<any> {
    return this.http
      .put(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public updateForm(endpoint: string, data: any): Observable<any> {
    return this.http
      .patch(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public callAction(endpoint: string, data: any, options?: ParseErrorOptions): Observable<any> {
    return this.http
      .post(endpoint, data)
      .pipe(
        catchError((error: any) => this.errors.handleError(error, options))
      );
  }

  public delete(endpoint: string, id: string, postfix?: string): Observable<any> {
    return this.http
      .delete(`${endpoint}${id}/` + (postfix ? `${postfix}/` : ''))
      .pipe(
        catchError((error: any) => this.errors.handleError(error, { showMessage: true }))
      );
  }

  public uploadFile(endpoint: string, data: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http
      .post(endpoint, data, { headers })
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }
}
