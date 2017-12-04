import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CookieService } from 'angular2-cookie/core';

import { ErrorsService } from '../../shared/services/errors.service';

@Injectable()
export class GenericFormService {

  constructor(
    private http: Http,
    private cookie: CookieService,
    private errors: ErrorsService
  ) { }

  public getByQuery(endpoint, query) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.get(`${endpoint}${query}`, { headers })
      .map((response: Response) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public getAll(endpoint) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.get(endpoint, { headers })
      .map((response: Response) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public getMetadata(endpoint, query = '') {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.options(`${endpoint}${query}`, { headers })
      .map((response: Response) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public submitForm(endpoint, data) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.post(endpoint, data, { headers })
      .map((response: Response) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public editForm(endpoint, data) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.put(endpoint, data, { headers })
      .map((response: Response) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public callAction(endpoint, data) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.post(endpoint, data, { headers })
      .map((response: Response) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public delete(endpoint, id) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.delete(`${endpoint}${id}/`, { headers })
      .map((response: Response) => response.json())
      .catch((error: any) => this.errors.parseErrors(error));
  }

  public updateHeaders(headers) {
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
  }

  public errorHandler(error) {
    return Observable.throw(error.json());
  }
}
