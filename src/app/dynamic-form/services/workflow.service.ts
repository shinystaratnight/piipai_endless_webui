import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorsService } from '../../shared/services/errors.service';

@Injectable()
export class WorkflowService {

  public workflowsEndpoint = '/core/workflows/';
  public workflowNodeEndpoint = '/core/workflownodes/';
  public companyWorkflowNodeEndpoint = '/core/companyworkflownodes/';
  public acceptenceTestEnpoint = '/acceptance-tests/acceptancetests/';
  public acceptanceTestWorkflowNodesEndpoint = '/acceptance-tests/acceptancetestworkflownodes/'; //tslint:disable-line

  constructor(
    private http: HttpClient,
    private errors: ErrorsService
  ) {}

  public getWorkflowList() {
    return this.http
      .get(this.workflowsEndpoint)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public getNodesOfCompany(workflowId: string, companyId: string) {
    const query = `?workflow_node__workflow=${workflowId}&company=${companyId}&active=true&limit=-1&only_parent=2&ordering=order,workflow_node.number`; //tslint:disable-line

    return this.http
      .get(this.companyWorkflowNodeEndpoint + query)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public getSubStates(workflowId: string, parentId: string) {
    const query = `?workflow_node__workflow=${workflowId}&workflow_node__parent=${parentId}&active=true&limit=-1`; //tslint:disable-line

    return this.http
      .get(this.companyWorkflowNodeEndpoint + query)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public setParentForSubstate(nodeId: string, parentId: string) {
    const body = {
      parent: parentId
    };

    return this.http
      .patch(`${this.workflowNodeEndpoint}${nodeId}/`, body)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public deleteParentForSubstate(nodeId: string) {
    const body = {
      parent: null
    };

    return this.http
      .patch(`${this.workflowNodeEndpoint}${nodeId}/`, body)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public deleteNode(id: string) {
    return this.http
      .delete(`${this.companyWorkflowNodeEndpoint}${id}/`)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public deleteTest(id: string) {
    return this.http
      .delete(`${this.acceptanceTestWorkflowNodesEndpoint}${id}/`)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public getAcceptenceTets(nodeId: string) {
    const query = `?company_workflow_node=${nodeId}`;

    return this.http
      .get(this.acceptanceTestWorkflowNodesEndpoint + query)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public addAcceptenceTest(body) {
    return this.http
      .post(this.acceptanceTestWorkflowNodesEndpoint, body)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public addWorkflowToCompany(data) {
    return this.http
      .post(this.companyWorkflowNodeEndpoint, data)
      .pipe(
        catchError((err: any) => this.errorHandler(err))
      );
  }

  public updateStateOrder(data: any, id: string) {
    return this.http
      .patch(this.companyWorkflowNodeEndpoint + id + '/', data)
      .pipe(
        catchError((err: any) => of([]))
      );
  }

  public errorHandler(error) {
    return this.errors.parseErrors(error);
  }
}
