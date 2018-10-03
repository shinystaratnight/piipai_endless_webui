import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { CookieService } from 'ngx-cookie';

import { Observable, combineLatest, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

import { ErrorsService } from './errors.service';
import { SiteService, PageData } from '../../services/site.service';
import { Page, NavigationService } from '../../services/navigation.service';

interface Permission {
  id: number;
  name: string;
  codename: string;
  model?: string;
}

export interface PermissionResponse {
  permission_list: Permission[];
  group_permission_list: Permission[];
}

@Injectable()
export class CheckPermissionService {

  private _permissions: Permission[];
  private userPermissionEndpoint = `/ecore/api/v2/permissions/user/`;

  constructor(
    private http: Http,
    private error: ErrorsService,
    private cookie: CookieService,
    private siteService: SiteService,
    private navigationService: NavigationService,
  ) { }

  get permissions() {
    return this._permissions;
  }

  set permissions(permissions: Permission[]) {
    this._permissions = this.filterPermissions(permissions);
  }

  public getPermissions(id: string): Observable<Permission[]> {
    if (!this.permissions) {
      return this.getUserPermissions(id);
    } else {
      return of(this.permissions);
    }
  }

  public checkPermission(id: string, url: any[], list: Page[]): Observable<boolean> {
    const permissions: Observable<Permission[]> = this.getPermissions(id);
    const page: Observable<PageData> = this.siteService.getDataOfPage(url, list);

    return combineLatest(permissions, page)
      .pipe(
        mergeMap((data: [Permission[], PageData]) => {
          if (!this.navigationService.parsedByPermissions) {
            this.parseNavigation(data[0], list);
          }

          const method = this.parseMethod(data[1].pathData.type, data[1].pathData.id);

          return of(this.getAllowMethods(data[0], data[1].endpoint).indexOf(method) > -1);
        })
      );

  }

  public getAllowMethods (permissions: Permission[] = this.permissions, endpoint: string): string[] { //tslint:disable-line
    if (endpoint === '/') {
      return ['get'];
    }

    if (permissions) {
      const allowMethods: Permission[] = permissions.filter((permission) => {
        const model = permission.codename.split('_')[0];
        return endpoint && endpoint.indexOf(model) > -1;
      });

      return allowMethods.length ? allowMethods.map((permission: Permission) => {
        return permission.codename.split('_').pop();
      }) : [];
    } else {
      return ['delete', 'get', 'post', 'update'];
    }

  }

  public parseNavigation(permissions: Permission[], list: Page[]): void {
    list.forEach((page: Page) => {
      if (page.endpoint !== '/') {
        const allowMethods = this.getAllowMethods(permissions, page.endpoint);

        page.disabled = allowMethods.indexOf('get') === -1;
      }

      if (page.childrens && page.childrens.length) {
        this.parseNavigation(permissions, page.childrens);
      }
    });
  }

  private parseMethod(type: string, id?: string): string {
    if (type === 'list' || (type === 'form' && id)) {
      return 'get';
    }

    if (type === 'form') {
      return 'post';
    }

    return 'delete';
  }

  private getUserPermissions(id: string): Observable<Permission[]> {
    const headers = new Headers();
    this.updateHeaders(headers);
    return this.http
      .get(this.userPermissionEndpoint + id + '/', { headers })
      .pipe(
        map((response: Response) => {
          const body: PermissionResponse = response.json();
          const permissions: Permission[] = [...body.permission_list, ...body.group_permission_list];
          this.permissions = permissions;

          return this.permissions;
        }),
        catchError((error: Response) => this.error.parseErrors(error))
      );
  }

  private filterPermissions(array: Permission[]): Permission[] {
    if (array) {
      const keys = {};
      const result = [];

      array.forEach((el: Permission) => {
        if (!keys[el.id]) {
          result.push(el);
          keys[el.id] = true;
        }
      });

      return result;
    }
  }

  private updateHeaders(headers) {
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
  }

}
