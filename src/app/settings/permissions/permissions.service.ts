import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie';

@Injectable()
export class PermissionsService {

  public endpoints = {
    base: 'ecore/api/v2/permissions/',
    user: 'ecore/api/v2/permissions/user/',
    group: 'ecore/api/v2/permissions/group/',
    users: 'ecore/api/v2/company_settings/users/',
    all: 'all/',
    add: 'set/',
    create: 'create/',
    addUser: 'add_user/',
    removeUser: 'remove_user/',
    revoke: 'revoke/',
    delete: 'delete/',
    groups: 'groups/',
    availableGroups: 'available_groups/'
  };

  constructor(
    private http: Http,
    private cookie: CookieService
  ) { }

  public getAllPermissions(query) {
    const endpoint = `${this.endpoints.base}${this.endpoints.all}?limit=-1`;
    const headers = this.updateHeaders();
    return this.http
      .get(endpoint, { headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public getAllUsers() {
    const endpoint = `${this.endpoints.users}`;
    const headers = this.updateHeaders();
    return this.http
      .get(endpoint, { headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public getPermissionsOfUser(id) {
    const endpoint = `${this.endpoints.user}${id}/`;
    const headers = this.updateHeaders();
    return this.http
      .get(endpoint, { headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public addPermissionsOnTheUser(id: string, permissions: string[]) {
    const endpoint = `${this.endpoints.user}${id}/${this.endpoints.add}`;
    const body = {
      permission_list: permissions
    };
    const headers = this.updateHeaders();
    return this.http
      .post(endpoint, body, { headers })
      .pipe(
        map((res: Response) => res),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public getGroupsOnTheUser(id: string) {
    const endpoint = `${this.endpoints.user}${id}/${this.endpoints.groups}`;
    const headers = this.updateHeaders();
    return this.http
      .get(endpoint, { headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public getAvailableGroupsOnTheUser(id: string) {
    const endpoint = `${this.endpoints.user}${id}/${this.endpoints.availableGroups}`;
    const headers = this.updateHeaders();
    return this.http
      .get(endpoint, { headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public revokePermissionsOfTheUser(id: string, permissions: string[]) {
    const endpoint = `${this.endpoints.user}${id}/${this.endpoints.revoke}`;
    const body = {
      permission_list: permissions
    };
    const headers = this.updateHeaders();
    return this.http
      .post(endpoint, body, { headers })
      .pipe(
        map((res: Response) => res),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public getAllGroups() {
    const endpoint = `${this.endpoints.base}${this.endpoints.groups}`;
    const headers = this.updateHeaders();
    return this.http
      .get(endpoint, { headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public getAllPermissionsOfTheGroup(id) {
    const endpoint = `${this.endpoints.group}${id}/`;
    const headers = this.updateHeaders();
    return this.http
      .get(endpoint, { headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public createGroup(name: string) {
    const endpoint = `${this.endpoints.base}${this.endpoints.groups}${this.endpoints.create}`;
    const body = {name};
    const headers = this.updateHeaders();
    return this.http
      .post(endpoint, body, { headers })
      .pipe(
        map((res: Response) => res),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public deleteGroup(id: string) {
    const endpoint = `${this.endpoints.group}${id}/${this.endpoints.delete}`;
    const headers = this.updateHeaders();
    return this.http
      .get(endpoint, { headers })
      .pipe(
        map((res: Response) => res.json()),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public addPermissionsOnTheGroup(id: string, permissions: string[]) {
    const endpoint = `${this.endpoints.group}${id}/${this.endpoints.add}`;
    const body = {
      permission_list: permissions
    };
    const headers = this.updateHeaders();
    return this.http
      .post(endpoint, body, { headers })
      .pipe(
        map((res: Response) => res),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public addUserOnTheGroup(groupId: string, userId: string) {
    const endpoint = `${this.endpoints.group}${groupId}/${this.endpoints.addUser}`;
    const body = {
      user_id: userId
    };
    const headers = this.updateHeaders();
    return this.http
      .post(endpoint, body, { headers })
      .pipe(
        map((res: Response) => res),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public removeUserOnTheGroup(groupId: string, userId: string) {
    const endpoint = `${this.endpoints.group}${groupId}/${this.endpoints.removeUser}`;
    const body = {
      user_id: userId
    };
    const headers = this.updateHeaders();
    return this.http
      .post(endpoint, body, { headers })
      .pipe(
        map((res: Response) => res),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public revokePermissionsOfTheGroup(id: string, permissions: string[]) {
    const endpoint = `${this.endpoints.group}${id}/${this.endpoints.revoke}`;
    const body = {
      permission_list: permissions
    };
    const headers = this.updateHeaders();
    return this.http
      .post(endpoint, body, { headers })
      .pipe(
        map((res: Response) => res),
        catchError((err: Response) => this.errorHandler(err))
      );
  }

  public updateHeaders() {
    const headers = new Headers();
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
    return headers;
  }

  public errorHandler(error) {
    return Observable.throw(error.json() || 'Server error.');
  }

}
