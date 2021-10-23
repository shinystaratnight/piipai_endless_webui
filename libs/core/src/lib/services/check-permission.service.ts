import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

import { ErrorsService } from './errors.service';
import { SiteService } from './site.service';
import { NavigationService } from './navigation.service';
import { Page, PageData } from '@webui/data';
import { EventService, EventType } from './event.service';

export interface Permission {
  id: number;
  name: string;
  codename: string;
  model?: string;
}

export interface PermissionResponse {
  permission_list: Permission[];
  group_permission_list: Permission[];
}

@Injectable({
  providedIn: 'root'
})
export class CheckPermissionService {
  private _permissions: Permission[];
  private userPermissionEndpoint = `/permissions/user/`;
  private subscriptionEndpoint = `/billing/subscription/list/`;

  constructor(
    private http: HttpClient,
    private error: ErrorsService,
    private siteService: SiteService,
    private navigationService: NavigationService,
    private eventService: EventService
  ) {
    this.eventService.event$.subscribe((type: EventType) => {
      if (type === EventType.PurposeChanged) {
        this.navigationService.updateNavigation().subscribe((pages: Page[]) => {
          this.parseNavigation(this.permissions, pages);
        });
      }

      if (type === EventType.Logout) {
        this.permissions = null;
      }
    });
  }

  get permissions() {
    return this._permissions;
  }

  set permissions(permissions: Permission[]) {
    this._permissions = this.filterPermissions(permissions);
  }

  public getPermissions(
    id: string
  ): Observable<Permission[]> {
    if (!this.permissions) {
      return this.getUserPermissions(id);
    } else {
      return of(this.permissions);
    }
  }

  public checkPermission(
    id: string,
    url: any[],
    list: Page[]
  ): Observable<boolean> {
    const permissions: Observable<Permission[]> = this.getPermissions(id);
    const page: Observable<PageData> = this.siteService.getDataOfPage(
      url,
      list
    );

    return forkJoin([permissions, page]).pipe(
      mergeMap((data: [Permission[], PageData]) => {
        if (!this.navigationService.parsedByPermissions) {
          this.parseNavigation(data[0], list);
        }

        const method = this.parseMethod(
          data[1].pathData.type,
          data[1].pathData.id
        );

        return of(
          this.getAllowMethods(data[0], data[1].endpoint).indexOf(method) > -1
        );
      })
    );
  }

  public getAllowMethods(
    permissions: Permission[] = this.permissions,
    endpoint: string
  ): string[] {
    //tslint:disable-line
    if (endpoint === '/') {
      return ['get'];
    }

    if (permissions) {
      // TODO: Remove it after adding permissions on backend
      if (
        endpoint &&
        endpoint.includes('/companies/') &&
        endpoint.includes('/languages/')
      ) {
        return ['delete', 'get', 'post', 'update'];
      }

      const allowMethods: Permission[] = permissions.filter((permission) => {
        const arr = permission.codename.split('_');
        arr.pop();

        const model = arr.join('_');
        return endpoint && endpoint.indexOf(`/${model}/`) > -1;
      });

      return allowMethods.length
        ? allowMethods.map((permission: Permission) => {
            return permission.codename.split('_').pop();
          })
        : [];
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

  public hasActiveSubscription() {
    return this.http
      .get<{ subscriptions: Array<any> }>(this.subscriptionEndpoint)
      .pipe(
        map(({ subscriptions }) => subscriptions.some((el) => el.active)),
        catchError((err: any) => this.error.handleError(err))
      );
  }

  public hasPermission(type: string, endpoint): boolean {
    return this.getAllowMethods(this.permissions, endpoint).includes(type);
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

  private getUserPermissions(
    id: string,
  ): Observable<Permission[]> {
    return forkJoin([
      this.http.get<PermissionResponse>(this.userPermissionEndpoint + id + '/')
    ]).pipe(
      map(([response]) => {
        let permissions: Permission[] = [
          ...response.permission_list,
          ...response.group_permission_list
        ];

        this.permissions = permissions;

        return this.permissions;
      }),
      catchError((error: HttpErrorResponse) => this.error.handleError(error))
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
}
