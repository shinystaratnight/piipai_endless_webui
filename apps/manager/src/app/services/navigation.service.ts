import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { GenericFormService } from '../dynamic-form/services/generic-form.service';
import { Role } from './user.service';
import { Endpoints } from '../metadata/helpers';
import { CompanyPurposeService, Purpose } from './company-purpose.service';

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
    private gfs: GenericFormService,
    private purposeService: CompanyPurposeService
  ) { }

  public getPages(role: Role, companyId?: string, update?: boolean) {
    if (role) {
      const { id } = role;

      if (!this.navigationList[id] || update) {
        const query = `?limit=-1&role=${id}`;
        return this.gfs.getByQuery(Endpoints.ExtranetNavigation, query)
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
            })
          );
      } else {
        return of(this.navigationList[id]);
      }
    }
  }

  public getCompanyPurpose(id: string): Observable<Purpose> {
    const query = `?fields=purpose`;

    return this.gfs.getByQuery(`${Endpoints.Company}${id}/`, query)
      .pipe(
        map((res: any) => {
          const { purpose } = res;
          this.purposeService.purpose = purpose;

          return purpose;
        })
      );
  }

  public getUserModules() {
    const query = '?limit=-1';

    return this.gfs
      .getByQuery(Endpoints.UserDashboardModule, query)
      .pipe(
        map((res: any) => {
          if (res.results) {
            this.userModels = res.results;
            return this.userModels;
          }
        })
    );
  }

  public getModules() {
    const query = '?limit=-1';

    return this.gfs
      .getByQuery(Endpoints.DashboardModule, query)
      .pipe(
        map((res: any) => {
          if (res.results) {
            this.models = res.results;
            return this.models;
          }
        })
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
}
