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
  public companyWorkflowNodeEndpoint = '/ecore/api/v2/core/companyworkflownodes/';
  public acceptenceTestEnpoint = '/ecore/api/v2/acceptance-tests/acceptancetests/';
  public acceptanceTestWorkflowNodesEndpoint = '/ecore/api/v2/acceptance-tests/acceptancetestworkflownodes/'; //tslint:disable-line

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

  public getNodesOfCompany(workflowId: string, companyId: string) {
    const headers = this.updateHeaders();

    const query = `?workflow_node__workflow=${workflowId}&company=${companyId}&active=true&limit=-1&only_parent=2&ordering=order,workflow_node.number`; //tslint:disable-line

    return this.http.get(this.companyWorkflowNodeEndpoint + query, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public getSubStates(workflowId: string, parentId: string) {
    const headers = this.updateHeaders();

    const query = `?workflow_node__workflow=${workflowId}&workflow_node__parent=${parentId}&active=true&limit=-1`; //tslint:disable-line

    return this.http.get(this.companyWorkflowNodeEndpoint + query, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public setParentForSubstate(nodeId: string, parentId: string) {
    const headers = this.updateHeaders();

    const body = {
      parent: parentId
    };

    return this.http.patch(`${this.workflowNodeEndpoint}${nodeId}/`, body, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public deleteParentForSubstate(nodeId: string) {
    const headers = this.updateHeaders();

    const body = {
      parent: null
    };

    return this.http.patch(`${this.workflowNodeEndpoint}${nodeId}/`, body, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public deleteNode(id: string) {
    const headers = this.updateHeaders();

    return this.http.delete(`${this.companyWorkflowNodeEndpoint}${id}/`, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public deleteTest(id: string) {
    const headers = this.updateHeaders();

    return this.http.delete(`${this.acceptanceTestWorkflowNodesEndpoint}${id}/`, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public getAcceptenceTets(nodeId: string) {
    const headers = this.updateHeaders();

    const query = `?company_workflow_node=${nodeId}`;

    return this.http.get(this.acceptanceTestWorkflowNodesEndpoint + query, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public addAcceptenceTest(body) {
    const headers = this.updateHeaders();

    return this.http.post(this.acceptanceTestWorkflowNodesEndpoint, body, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public addWorkflowToCompany(data) {
    const headers = this.updateHeaders();

    return this.http.post(this.companyWorkflowNodeEndpoint, data, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => this.errorHandler(err));
  }

  public updateStateOrder(data: any, id: string) {
    const headers = this.updateHeaders();

    return this.http.patch(this.companyWorkflowNodeEndpoint + id + '/', data, { headers })
      .map((res: any) => res && res.json())
      .catch((err: any) => Observable.of([]));
  }

  public updateHeaders(): Headers {
    const headers = new Headers();
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
    return headers;
  }

  public errorHandler(error) {
    return this.errors.parseErrors(error);
  }
}
