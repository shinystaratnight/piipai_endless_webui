import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CookieService } from 'angular2-cookie/core';

import { ErrorsService } from '../../shared/services/errors.service';
import { metadata } from '../../metadata';

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
      .map((response: any) => response._body ? response.json() : {})
      .catch((error: any) => this.errorHandler(error));
  }

  public getAll(endpoint) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.get(endpoint, { headers })
      .map((response: any) => response._body ? response.json() : {})
      .catch((error: any) => this.errorHandler(error));
  }

  public getMetadata(endpoint, query = '') {
    let headers = new Headers();
    this.updateHeaders(headers);

    if (endpoint.includes('/submit')) {
      endpoint = 'submit';
    }

    if (endpoint.includes('/evaluate')) {
      endpoint = 'evaluate';
    }

    if (endpoint.includes('/not_agree')) {
      endpoint = 'not_agree';
    }

    if (endpoint.includes('/extend')) {
      endpoint = 'extend';
    }

    if (endpoint.includes('/fillin')) {
      endpoint = 'fillin';
    }

    if (metadata[endpoint]) {
      let type = '';

      if (query.includes('formadd')) {
        type = 'formadd';
        if (query.includes('job')) {
          type = 'jobAdd';
        }

        if (query.includes('contact')) {
          type = 'contact';
        }
      } else if (query.includes('pricelist')) {
        type = 'pricelist';
      } else if (query.includes('company')) {
        type = 'company';
      } else if (query.includes('supervisor')) {
        type = 'supervisor';
      } else if (query.includes('job')) {
        type = 'job';
      } else if (query.includes('shift_date')) {
        type = 'shiftDate';
      } else if (query.includes('extend')) {
        type = 'extend';
      } else if (query.includes('formset')) {
        type = 'formset';
      } else if (query.includes('form')) {
        type = 'form';
      } else {
        type = 'list';
      }

      const stringifyMetadata =
        JSON.stringify(metadata[endpoint][type]);

      return Observable.of(JSON.parse(stringifyMetadata));
    }

    return this.http.options(`${endpoint}${query}`, { headers })
      .map((response: any) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public submitForm(endpoint, data) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.post(endpoint, data, { headers })
      .map((response: any) => response._body ? response.json() : {})
      .catch((error: any) => this.errorHandler(error));
  }

  public editForm(endpoint, data) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.put(endpoint, data, { headers })
      .map((response: any) => response._body ? response.json() : {})
      .catch((error: any) => this.errorHandler(error));
  }

  public callAction(endpoint, data) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.post(endpoint, data, { headers })
      .map((response: any) => response._body ? response.json() : {})
      .catch((error: any) => this.errorHandler(error));
  }

  public delete(endpoint, id, postfix?) {
    let headers = new Headers();
    this.updateHeaders(headers);
    return this.http.delete(`${endpoint}${id}/` + (postfix ? `${postfix}/` : ''), { headers })
      .map((response: any) => response._body ? response.json() : {})
      .catch((error: any) => this.errors.parseErrors(error));
  }

  public updateHeaders(headers) {
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
  }

  public errorHandler(error) {
    return Observable.throw(error.json());
  }
}
