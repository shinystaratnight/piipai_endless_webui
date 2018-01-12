import { Injectable } from '@angular/core';
import { GenericFormService } from '../dynamic-form/services/generic-form.service';

import { Observable } from 'rxjs/Observable';

export interface Page {
  name: string;
  url: string;
  endpoint: string;
  __str__: string;
  childrens: Page[];
}

@Injectable()
export class NavigationService {

  public navigationList: Page[];
  public userModels: any;
  public models: any;
  public endpoint = '/ecore/api/v2/core/extranetnavigations/?limit=-1';
  public userModelsEndpoint = '/ecore/api/v2/core/userdashboardmodules/?limit=-1';
  public modelsListEndpoint = '/ecore/api/v2/core/dashboardmodules/?limit=-1';
  public error;

  public linksList: Page[] = [];

  constructor(
    private gfs: GenericFormService
  ) { }

  public getPages() {
    if (!this.navigationList) {
      return this.gfs.getAll(this.endpoint).map(
        (res: any) => {
          if (res.results) {
            this.navigationList = res.results;
            this.generateLinks(this.navigationList, this.linksList);
            return this.navigationList;
          }
        }
      );
    } else {
      return Observable.of(this.navigationList);
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
    return this.getPages();
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
