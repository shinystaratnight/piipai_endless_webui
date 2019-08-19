import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { Endpoints, Role, Purpose } from '@webui/data';

import { CompanyPurposeService } from './company-purpose.service';
import { ErrorsService } from './errors.service';

export interface Page {
  name: string;
  url: string;
  endpoint: string;
  __str__: string;
  childrens: Page[];
  disabled?: boolean;
}

@Injectable()
export class NavigationService {

  public currentRole: Role;
  public userModels: any;
  public models: any;
  public error;
  public parsedByPermissions: boolean;

  public navigationList: any = {};
  public linksList: Page[] = [];

  constructor(
    private http: HttpClient,
    private purposeService: CompanyPurposeService,
    private errorService: ErrorsService
  ) { }

  public getPages(role: Role, companyId?: string, update?: boolean) {
    if (role) {
      const { id } = role;

      if (!this.navigationList[id] || update) {
        const query = `?limit=-1&role=${id}`;
        return this.http.get(`${Endpoints.ExtranetNavigation}${query}`)
          .pipe(
            mergeMap((res: any) => {
              if (companyId) {
                return this.getCompanyPurpose(companyId)
                  .pipe(map((purpose: Purpose) => ({ purpose, list: res.results })));
              } else {
                return of({ list: res.results });
              }
            }),
            map((res: { purpose: Purpose, list: any[] }) => {
              this.removePrefix(res.list);
              if (res.list) {
                const list = res.purpose
                  ? this.purposeService.filterNavigationByPurpose(res.purpose, res.list)
                  : res.list;
                this.currentRole = role;
                this.navigationList[id] = list;
                this.linksList.length = 0;
                this.generateLinks(this.navigationList[id], this.linksList);

                return this.navigationList[id];
              }
            }),
            catchError((errors) => this.errorService.parseErrors(errors))
          );
      } else {
        return of(this.navigationList[id]);
      }
    }
  }

  public updateNavigation(companyId: string) {
    return this.getPages(this.currentRole, companyId, true);
  }

  public getCompanyPurpose(id: string): Observable<Purpose> {
    return this.http.get(`${Endpoints.Company}${id}/?fields=purpose`)
      .pipe(
        map((res: any) => {
          const { purpose } = res;
          this.purposeService.purpose = purpose;

          return purpose;
        }),
        catchError((errors) => this.errorService.parseErrors(errors))
      );
  }

  public getUserModules() {
    return this.http
      .get(`${Endpoints.UserDashboardModule}?limit=-1`)
      .pipe(
        map((res: any) => {
          if (res.results) {
            this.userModels = res.results;
            return this.userModels;
          }
        }),
        catchError((errors) => this.errorService.parseErrors(errors))
    );
  }

  public getModules() {
    return this.http
      .get(`${Endpoints.DashboardModule}?limit=-1`)
      .pipe(
        map((res: any) => {
          if (res.results) {
            this.models = res.results;
            return this.models;
          }
        }),
        catchError((errors) => this.errorService.parseErrors(errors))
      );
  }

  public resolve() {
    return this.getPages(this.currentRole);
  }

  public setCurrentRole(role: Role) {
    this.currentRole = role;
    if (this.navigationList[role.id]) {
      this.linksList.length = 0;
      this.generateLinks(this.navigationList[role.id], this.linksList);
    }
  }

  public generateLinks(links, target) {
    links.forEach((el) => {
      target.push(el);
      if (el.childrens) {
        this.generateLinks(el.childrens, target);
      }
    });
  }

  public removePrefix(list: Page[]) {
    list.forEach((page) => {
      ['/mn/', '/cl/', '/cd/'].forEach((prefix) => {
        page.url = page.url.replace(prefix, '/');
      })

      if (page.childrens && page.childrens.length) {
        this.removePrefix(page.childrens);
      }
    });
  }
}
