import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CompanyPurposeService, ErrorsService, SiteSettingsService } from '@webui/core';
import { getPropValue, FormatString } from '@webui/utilities';

@Injectable()
export class ListService {

  private _updateList = new Subject();
  private _updateRow = new Subject();

  changes = new Map();

  updateActions: Function[];
  updateButtons: Map<string, BehaviorSubject<boolean>>;

  config: any;
  data: any[];

  get update$(): Observable<any> {
    return this._updateList.asObservable();
  }

  get updateRow$(): Observable<any> {
    return this._updateRow.asObservable();
  }

  constructor(
    private http: HttpClient,
    private errorsService: ErrorsService,
    private companyPurposeService: CompanyPurposeService,
    private settingsService: SiteSettingsService,
  ) {}

  updateList() {
    this._updateList.next(Date.now());
  }

  saveChanges(id: string) {
    const data = this.getRowData(id);
    const canEdit = getPropValue(data, this.config.canEdit);
    const { create } = this.config;

    if (canEdit) {
      this.send(id);
    } else if (create) {
      const endpoint = create.endpoint;
      const body = {};

      Object.keys(create.fields).forEach((key: string) => {
        if (create.fields[key] === 'currentCompany') {
          body[key] = this.settingsService.settings.company_settings.company;
        } else if (typeof create.fields[key] === 'string') {
          body[key] = getPropValue(data, create.fields[key]);
        } else {
          body[key] = create.fields[key];
        }
      });

      this.post(endpoint, body)
        .subscribe((res: any) => {
          const additionalData = {};
          Object.keys(create.addFields).forEach((key) => {
            additionalData[key] = getPropValue(res, create.addFields[key]);
          });

          Object.assign(data, additionalData);
          this.send(id);
        });
    }
  }

  send(id: string) {
    const data = this.getRowData(id);
    const { update } = this.config;
    const method = update.method;
    const changes = this.changes.get(id);
    const endpoint = FormatString.format(update.endpoint, data);

    if (this[method]) {
      this[method](endpoint, changes)
        .subscribe(() => {
          this._updateRow.next({id, data: changes});
          this.changes.clear();
        });
    }
  }

  updateChanges(id: string, data: any) {
    const exist = this.changes.has(id);
    const rowData = this.getRowData(id);
    const { update } = this.config;

    if (exist) {
      this.updateChangesObject(id, data);
    } else {
      this.changes.set(id, data);
    }

    if (update.fields) {
      update.fields.forEach((field) => {
        data[field] = getPropValue(this.getChanges(id), field) || getPropValue(rowData, field);
      });
    }

    this.updateActions.forEach((action) => {
      const actionData = action(this.changes.get(id), { purpose: this.companyPurposeService.purpose });

      if (actionData) {
        this.updateChangesObject(id, actionData);
      }
    });

    this.showSaveButton(id);
  }

  private showSaveButton(id: string) {
    const button = this.updateButtons.get(id);

    button.next(true);
  }

  private getChanges(id: string): any {
    return this.changes.get(id) || {};
  }

  private updateChangesObject(id: string, data: any) {
    const existChanges = this.getChanges(id);
    const newChanges = { ...existChanges, ...data };

    this.changes.set(id, newChanges);
  }

  private post(url: string, body: any): Observable<any> {
    return this.http.post(url, body).pipe(
      catchError(
        (error: any) => this.errorsService.parseErrors(error)
      )
    )
  }

  private getRowData(id: string): any {
    return this.data.find(el => el.id === id);
  }

}
