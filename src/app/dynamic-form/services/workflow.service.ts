import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie';

import { ErrorsService } from '../../shared/services/errors.service';

@Injectable()
export class WorkflowService {

  public workflowsEndpoint = '/core/workflows/';
  public workflowNodeEndpoint = '/core/workflownodes/';
  public companyWorkflowNodeEndpoint = '/core/companyworkflownodes/';
  public acceptenceTestEnpoint = '/acceptance-tests/acceptancetests/';
  public acceptanceTestWorkflowNodesEndpoint = '/acceptance-tests/acceptancetestworkflownodes/'; //tslint:disable-line

  constructor(
    private http: Http,
    private cookie: CookieService,
    private errors: ErrorsService
  ) {}

  public getWorkflowList() {
    const headers = this.updateHeaders();

    return this.http
      .get(this.workflowsEndpoint, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public getNodesOfCompany(workflowId: string, companyId: string) {
    const headers = this.updateHeaders();

    const query = `?workflow_node__workflow=${workflowId}&company=${companyId}&active=true&limit=-1&only_parent=2&ordering=order,workflow_node.number`; //tslint:disable-line

    return this.http
      .get(this.companyWorkflowNodeEndpoint + query, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public getSubStates(workflowId: string, parentId: string) {
    const headers = this.updateHeaders();

    const query = `?workflow_node__workflow=${workflowId}&workflow_node__parent=${parentId}&active=true&limit=-1`; //tslint:disable-line

    return this.http
      .get(this.companyWorkflowNodeEndpoint + query, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public setParentForSubstate(nodeId: string, parentId: string) {
    const headers = this.updateHeaders();

    const body = {
      parent: parentId
    };

    return this.http
      .patch(`${this.workflowNodeEndpoint}${nodeId}/`, body, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public deleteParentForSubstate(nodeId: string) {
    const headers = this.updateHeaders();

    const body = {
      parent: null
    };

    return this.http
      .patch(`${this.workflowNodeEndpoint}${nodeId}/`, body, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public deleteNode(id: string) {
    const headers = this.updateHeaders();

    return this.http
      .delete(`${this.companyWorkflowNodeEndpoint}${id}/`, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public deleteTest(id: string) {
    const headers = this.updateHeaders();

    return this.http
      .delete(`${this.acceptanceTestWorkflowNodesEndpoint}${id}/`, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public getAcceptenceTets(nodeId: string) {
    const headers = this.updateHeaders();

    const query = `?company_workflow_node=${nodeId}`;

    return this.http
      .get(this.acceptanceTestWorkflowNodesEndpoint + query, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public addAcceptenceTest(body) {
    const headers = this.updateHeaders();

    return this.http
      .post(this.acceptanceTestWorkflowNodesEndpoint, body, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public addWorkflowToCompany(data) {
    const headers = this.updateHeaders();

    return this.http
      .post(this.companyWorkflowNodeEndpoint, data, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public updateStateOrder(data: any, id: string) {
    const headers = this.updateHeaders();

    return this.http
      .patch(this.companyWorkflowNodeEndpoint + id + '/', data, { headers })
      .pipe(
        map((res: any) => res && res.json()),
        catchError((err: any) => of([]))
      );
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
