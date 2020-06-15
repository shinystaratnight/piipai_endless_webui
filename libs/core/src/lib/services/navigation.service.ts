import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { Endpoints, Role, Purpose } from '@webui/data';

import { CompanyPurposeService } from './company-purpose.service';
import { ErrorsService } from './errors.service';
import { EventService, EventType } from './event.service';
// import { SiteSettingsService } from './site-settings.service';
import { UserService } from './user.service';
import { isManager, getCurrentRole, isClient } from '@webui/utilities';

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

      if (!this.navigationList[id] || update) {
        const query = `?limit=-1&role=${id}`;
        return this.http.get(`${Endpoints.ExtranetNavigation}${query}`).pipe(
          mergeMap((res: any) => {
            if (isManager()) {
              const companyId = this.userService.companyId;

              return this.purposeService
                .getPurpose(companyId)
                .pipe(
                  map((purpose: Purpose) => ({ purpose, list: res.results }))
                );
            } else {
              return of({ list: res.results });
            }
          }),
          map((res: { purpose: Purpose; list: any[] }) => {
            this.removePrefix(res.list);
            if (res.list) {
              let list = res.purpose
                ? this.purposeService.filterNavigationByPurpose(
                    res.purpose,
                    res.list
                  )
                : res.list;

              if (isClient() && !this.userService.user.data.allow_job_creation) {
                const endpoints = [Endpoints.ClientJobs, Endpoints.JobsiteClient];
                list = list.filter((el) => !endpoints.includes(el.endpoint));
              }

              this.currentRole = role;
              this.navigationList[id] = list;
              this.linksList.length = 0;
              this.generateLinks(this.navigationList[id], this.linksList);

              return this.navigationList[id];
            }
          }),
          catchError(errors => this.errorService.parseErrors(errors))
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
    links.forEach(el => {
      target.push(el);
      if (el.childrens) {
        this.generateLinks(el.childrens, target);
      }
    });
  }

  public removePrefix(list: Page[]) {
    list.forEach(page => {
      ['/mn/', '/cl/', '/cd/'].forEach(prefix => {
        page.url = page.url.replace(prefix, '/');
      });

      if (page.childrens && page.childrens.length) {
        this.removePrefix(page.childrens);
      }
    });
  }
}
