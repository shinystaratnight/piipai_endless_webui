import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Endpoints, Purpose } from '@webui/data';
import { ErrorsService } from './errors.service';
import { ToastService, MessageType } from './toast.service';

@Injectable()
export class CompanyPurposeService {
  public purpose: Purpose;

  // hideListColumns = {
  //   [Endpoints.SkillName]: {
  //     [Purpose.SelfUse]: ['price_list_default_rate'],
  //     [Purpose.Recruitment]: ['price_list_default_rate']
  //   }
  // };

  constructor(
    private http: HttpClient,
    private errors: ErrorsService,
    private toastr: ToastService
  ) {}

  public filterModules(modules: any[]) {
    switch (this.purpose) {
      case Purpose.Recruitment:
        return this.filterByEndpoint([Endpoints.CandidateContact], modules);
      case Purpose.SelfUse:
        return this.filterByEndpoint(
          [Endpoints.CompanyContact, Endpoints.Job, Endpoints.CandidateContact],
          modules
        );
      case Purpose.Hire:
        return this.filterByEndpoint(
          [
            Endpoints.Company,
            Endpoints.Job,
            Endpoints.CompanyContact,
            Endpoints.CandidateContact
          ],
          modules
        );
    }
  }

  public filterNavigationByPurpose(purpose: Purpose, navigation: any[]) {
    switch (purpose) {
      case Purpose.Recruitment:
        return this.filterByName(['allocations', 'accounts'], navigation);
      case Purpose.SelfUse:
        return this.filterByName(['clients'], navigation);
      default:
        return navigation;
    }
  }

  // public filterListColumns(endpoint: string, columns: any[]) {
  //   const hideColumns: string[] = this.hideListColumns[endpoint];

  //   if (hideColumns && hideColumns[this.purpose]) {
  //     return columns.filter(column => {
  //       return !hideColumns[this.purpose].includes(column.name);
  //     });
  //   }

  //   return columns;
  // }

  getPurpose(id: string): Observable<any[] | Purpose> {
    const query = { fields: ['purpose'] };
    const params = new HttpParams({ fromObject: query });

    if (this.purpose) {
      return of(this.purpose);
    }

    return this.http.get(Endpoints.Company + id + '/', { params }).pipe(
      tap((res: { id: string; purpose: Purpose }) => {
        this.purpose = res.purpose;
      }),
      map((res: { id: string; purpose: Purpose }) => res.purpose),
      catchError((err: HttpErrorResponse) => this.errors.parseErrors(err))
    );
  }

  changePurpose(id: string, purpose: Purpose) {
    return this.http
      .put(Endpoints.Company + id + '/change_purpose/', { purpose, id })
      .pipe(
        tap((res: any) => {
          this.purpose = purpose;
          this.toastr.sendMessage(res.message, MessageType.success);
        })
      );
  }

  private filterByName(keys: string[], navigation) {
    return navigation.filter(el => {
      let result = true;

      if (keys.includes(el.name.toLowerCase())) {
        result = false;
      }

      if (el.childrens && result) {
        el.childrens = this.filterByName(keys, el.childrens);
      }

      return result;
    });
  }

  private filterByEndpoint(endpoints: string[], modules) {
    modules.forEach(el => {
      const { link } = el;

      if (endpoints.includes(link)) {
        el.is_active = true;
      } else {
        el.is_active = false;
      }
    });
  }
}
