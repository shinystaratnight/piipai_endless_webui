import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CompanyPurposeService, ErrorsService } from '@webui/core';

@Injectable()
export class ListService {

  private _updateList = new Subject();
  private _updateRow = new Subject();

  updateActions: Function[];

  get update$(): Observable<any> {
    return this._updateList.asObservable();
  }

  get updateRow$(): Observable<any> {
    return this._updateRow.asObservable();
  }

  constructor(
    private http: HttpClient,
    private errorsService: ErrorsService,
    private companyPurposeService: CompanyPurposeService
  ) {}

  updateList() {
    this._updateList.next(Date.now());
  }

  updateListObject(endpoint: string, id: string, data: any) {
    this.updateActions.forEach((action) => {
      const actionData = action(data, { purpose: this.companyPurposeService.purpose });

      if (actionData) {
        Object.assign(data, actionData);
      }
    });

    this.update(endpoint, data)
      .subscribe(() => this._updateRow.next({ id, data }));
  }

  createObject(url: string, body: any) {
    return this.http.post(url, body).pipe(
      catchError(
        (error: any) => this.errorsService.parseErrors(error)
      )
    )
  }

  private update(url: string, body: any): Observable<any> {
    return this.http.post(url, body).pipe(
      catchError(
        (error: any) => this.errorsService.parseErrors(error)
      )
    )
  }

}
