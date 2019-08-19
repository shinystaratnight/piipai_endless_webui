import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { FormatString, getPropValue } from '@webui/utilities';
import { CompanyPurposeService, ErrorsService } from '@webui/core';
import { Endpoints } from '@webui/data';

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
    console.log(arguments);
    endpoint = FormatString.format(endpoint, { id });

    of(data).subscribe((res) => {
      this.updateActions.forEach((action) => {
        const actionData = action(res, { purpose: this.companyPurposeService.purpose });
        console.log(actionData);
      });

      this._updateRow.next({ id, data: res });
    });
    // return this.service.updateForm(endpoint, data)
    //   .pipe(
    //     this.updateActions.forEach((action) => {
    //       const actionData = action(res, { purpose: this.companyPurposeService.purpose });
    //       console.log(actionData);
    //     })
    //   );
  }

  private update(url: string, body: any): Observable<any> {
    return this.http.patch(url, body).pipe(
      catchError(
        (error: any) => this.errorsService.parseErrors(error)
      )
    )
  }

}
