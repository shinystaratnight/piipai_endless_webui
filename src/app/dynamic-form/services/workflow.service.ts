import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CookieService } from 'angular2-cookie/core';

import { ErrorsService } from '../../shared/services/errors.service';

import { metadata } from '../../metadata';

@Injectable()
export class WorkflowService {

  public workflowsEndpoint = '/ecore/api/v2/core/workflows/';
  public workflowNodeEndpoint = '/ecore/api/v2/core/workflownodes/';

  constructor(
    private http: Http,
    private cookie: CookieService,
    private errors: ErrorsService
  ) {}

  public getWorkflowList() {
    const headers = this.updateHeaders();

    return this.http.get(this.workflowsEndpoint, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public addWorkflow() {

  }

  public updateHeaders(): Headers {
    const headers = new Headers();
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
    return headers;
  }

  public errorHandler(error) {
    return Observable.throw(error.json());
  }
}
