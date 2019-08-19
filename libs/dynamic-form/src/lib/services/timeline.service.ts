import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorsService } from '@webui/core';
import { Endpoints } from '@webui/data';

export enum TimelineAction {
  Reset,
  Update
}

@Injectable()
export class TimelineService {

  get action$() {
    return this._action.asObservable();
  }

  get buttonAction$() {
    return this._buttonAction.asObservable();
  }

  private _action = new Subject();
  private _buttonAction = new Subject();

  constructor(
    private http: HttpClient,
    private errorsService: ErrorsService
  ) {}

  emit(action: TimelineAction | any) {
    this._action.next(action);
  }

  getTimeline(params: { [key: string]: string }): Observable<any> {
    const options = {
      params: new HttpParams({ fromObject: params})
    };

    return this.http.get(Endpoints.Timeline, options)
      .pipe(catchError((error) => this.errorsService.parseErrors(error)));
  }

  activateState(objectId: string, stateId: string, active = false): Observable<any> {
    const body = {
      object_id: objectId,
      state: {
        id: stateId
      },
      comment: null,
      active
    };

    return this.http.post(Endpoints.WorkflowObject, body)
      .pipe(catchError((error) => this.errorsService.parseErrors(error)));
  }

  passTests(tests: any[]): Observable<any> {
    return this.http.post(Endpoints.AcceptenceTestPassAnswers, tests)
      .pipe(catchError((error) => this.errorsService.parseErrors(error)));
  }

  editContact(action) {
    this._buttonAction.next(action);
  }

}
