import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { Endpoints, Role, Purpose } from '@webui/data';

import { CompanyPurposeService } from './company-purpose.service';
import { ErrorsService } from './errors.service';
import { EventService, EventType } from './event.service';
import { UserService } from './user.service';
import { isManager, getCurrentRole, isClient } from '@webui/utilities';

export interface Page {
  name: string;
  url: string;
  endpoint: string;
  __str__: string;
  translateKey: string;
  disabled?: boolean;
  active?: boolean;
  childrens: Page[];
}

type NavigationResponse = {
  message: string;
  count: number;
  results: Page[];
};

const jobEndpoints = [Endpoints.ClientJobs, Endpoints.JobsiteClient];

@Injectable()
export class NavigationService {
  public currentRole: Role;
  public error;
  public parsedByPermissions: boolean;

  public navigationList: any = {};
  public linksList: Page[] = [];

  constructor(
    private http: HttpClient,
    private purposeService: CompanyPurposeService,
    private errorService: ErrorsService,
    private userService: UserService,
    private eventService: EventService
  ) {
    this.eventService.event$.subscribe((type: EventType) => {
      if (type === EventType.Logout) {
        this.navigationList = {};
      }

      if (type === EventType.RoleChanged) {
        const role = getCurrentRole();
        this.setCurrentRole(role);
      }
    });
  }

  public getPages(role: Role, update?: boolean) {
    if (role) {
      const { id } = role;
      const { country_code, allow_job_creation } = this.userService.user.data;

      if (!this.navigationList[id] || update) {
        const params = new HttpParams({
          fromObject: {
            limit: '-1',
            role: id
          }
        });

        return this.http
          .get<NavigationResponse>(Endpoints.ExtranetNavigation, { params })
          .pipe(
            mergeMap(({ results: list }) => {
              if (isManager()) {
                const companyId = this.userService.companyId;

                return this.purposeService
                  .getPurpose(companyId)
                  .pipe(map((purpose: Purpose) => ({ purpose, list })));
              } else {
                return of({ list, purpose: null });
              }
            }),
            map(({ purpose, list }) => {
              this.removePrefix(list);
              this.removeMYOBLink(list, country_code);
              this.hideCandidateConsentUrl(list);

              if (list) {
                let result = list;

                if (purpose) {
                  result = this.purposeService.filterNavigationByPurpose(
                    purpose,
                    list
                  );
                }

                if (isClient() && !allow_job_creation) {
                  result = result.filter(
                    (el) => !jobEndpoints.includes(el.endpoint as Endpoints)
                  );
                }

                this.currentRole = role;
                this.generateTranslateKeys(result);
                this.navigationList[id] = result;
                this.linksList.length = 0;
                this.generateLinks(this.navigationList[id], this.linksList);

                return this.navigationList[id];
              }
            }),
            catchError((errors) => this.errorService.handleError(errors))
          );
      } else {
        return of(this.navigationList[id]);
      }
    }
  }

  public updateNavigation() {
    return this.getPages(this.currentRole, true);
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

  public removePrefix(list: Page[]): void {
    list.forEach((page) => {
      ['/mn/', '/cl/', '/cd/'].forEach((prefix) => {
        page.url = page.url.replace(prefix, '/');
      });

      if (page.childrens && page.childrens.length) {
        this.removePrefix(page.childrens);
      }
    });
  }

  private generateTranslateKeys(pages: Page[]) {
    pages.forEach((page) => {
      page.translateKey = page.url === '/' ? page.name.toLowerCase() : page.url;

      if (page.childrens) {
        this.generateTranslateKeys(page.childrens);
      }
    });
  }

  private hideCandidateConsentUrl(list: Page[]) {
    list.forEach((page: Page, index: number) => {
      if (page.endpoint.indexOf('/candidate/candidatecontacts/consent/') > -1) {
        list.splice(index, 1);
      }

      if (page.childrens) {
        this.hideCandidateConsentUrl(page.childrens);
      }
    });
  }

  private removeMYOBLink(pages: Page[], countryCode: string) {
    if (countryCode.toLocaleLowerCase() === 'au') {
      return;
    }

    pages.forEach((el: Page, index: number) => {
      if (el.endpoint === Endpoints.MYOB) {
        pages.splice(index, 1);
      }

      if (el.childrens) {
        this.removeMYOBLink(el.childrens, countryCode);
      }
    });
  }
}
