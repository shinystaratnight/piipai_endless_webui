import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CookieService } from 'angular2-cookie/core';

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
    revoke: 'revoke/',
    delete: 'delete/',
    groups: 'groups/'
  };

  constructor(
    private http: Http,
    private cookie: CookieService
  ) { }

  public getAllPermissions(query = undefined) {
    let endpoint = `${this.endpoints.base}${this.endpoints.all}?limit=-1`;
    let headers = this.updateHeaders();
    return this.http.get(endpoint, { headers })
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public getAllUsers() {
    let endpoint = `${this.endpoints.users}`;
    this.updateHeaders();
    return this.http.get(endpoint)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public getPermissionsOfUser(id) {
    let endpoint = `${this.endpoints.user}${id}/`;
    this.updateHeaders();
    return this.http.get(endpoint)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public addPermissionsOnTheUser(id: string, permissions: string[]) {
    let endpoint = `${this.endpoints.user}${id}/${this.endpoints.add}`;
    let body = {
      permission_list: permissions
    };
    this.updateHeaders();
    return this.http.post(endpoint, body)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public getGroupsOnTheUser(id: string) {
    let endpoint = `${this.endpoints.user}${id}/${this.endpoints.groups}`;
    this.updateHeaders();
    return this.http.get(endpoint)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public revokePermissionsOfTheUser(id: string, permissions: string[]) {
    let endpoint = `${this.endpoints.user}${id}/${this.endpoints.revoke}`;
    this.updateHeaders();
    return this.http.get(endpoint)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public getAllGroups() {
    let endpoint = `${this.endpoints.base}${this.endpoints.groups}`;
    this.updateHeaders();
    return this.http.get(endpoint)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public getAllPermissionsOfTheGroup(id) {
    let endpoint = `${this.endpoints.group}${id}/`;
    this.updateHeaders();
    return this.http.get(endpoint)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public createGroup(name: string) {
    let endpoint = `${this.endpoints.groups}${this.endpoints.create}`;
    let body = {name};
    this.updateHeaders();
    return this.http.post(endpoint, body)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public deleteGroup(id: string) {
    let endpoint = `${this.endpoints.group}${id}/${this.endpoints.delete}`;
    this.updateHeaders();
    return this.http.get(endpoint)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public addPermissionsOnTheGroup(id: string, permissions: string[]) {
    let endpoint = `${this.endpoints.group}${id}/${this.endpoints.add}`;
    let body = {
      permission_list: permissions
    };
    this.updateHeaders();
    return this.http.post(endpoint, body)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public addUserOnTheGroup(groupId: string, userId: string) {
    let endpoint = `${this.endpoints.group}${groupId}/${this.endpoints.addUser}`;
    let body = {
      user_id: userId
    };
    this.updateHeaders();
    return this.http.post(endpoint, body)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public revokePermissionsOfTheGroup(id: string, permissions: string[]) {
    let endpoint = `${this.endpoints.group}${id}/${this.endpoints.revoke}`;
    let body = {
      permission_list: permissions
    };
    this.updateHeaders();
    return this.http.post(endpoint, body)
                    .map((res: Response) => res.json())
                    .catch((err: Response) => this.errorHandler(err));
  }

  public updateHeaders() {
    let headers = new Headers();
    headers.append('X-CSRFToken', this.cookie.get('csrftoken'));
    return headers;
  }

  public errorHandler(error) {
    return Observable.throw(error.json() || 'Server error.');
  }

}
