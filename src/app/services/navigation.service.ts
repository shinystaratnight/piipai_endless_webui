import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { GenericFormService } from '../dynamic-form/services/generic-form.service';
import { Role } from './user.service';

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
  public endpoint = '/ecore/api/v2/core/extranetnavigations/?limit=-1';
  public userModelsEndpoint = '/ecore/api/v2/core/userdashboardmodules/?limit=-1';
  public modelsListEndpoint = '/ecore/api/v2/core/dashboardmodules/?limit=-1';
  public linksList: Page[] = [];

  constructor(
    private gfs: GenericFormService,
  ) { }

  public getPages(role: Role) {
    if (!this.navigationList[role.id]) {
      let query = `&role=${role.id}`;
      return this.gfs.getAll(`${this.endpoint}${query}`)
        .map(
        (res: any) => {
          if (res.results) {
            this.currentRole = role;
            this.navigationList[role.id] = res.results;
            this.linksList.length = 0;
            this.generateLinks(this.navigationList[role.id], this.linksList);

            return this.navigationList[role.id];
          }
        }
      );
    } else {
      return Observable.of(this.navigationList[role.id]);
    }
  }

  public getUserModules() {
    return this.gfs.getAll(this.userModelsEndpoint).map(
      (res: any) => {
        if (res.results) {
          this.userModels = res.results;
          return this.userModels;
        }
      }
    );
  }

  public getModules() {
    return this.gfs.getAll(this.modelsListEndpoint).map(
      (res: any) => {
        if (res.results) {
          this.models = res.results;
          return this.models;
        }
      }
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
