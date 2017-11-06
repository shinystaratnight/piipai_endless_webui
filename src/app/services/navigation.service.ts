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
  public endpoint = '/ecore/api/v2/endless-core/extranetnavigations/?limit=-1';
  public userModelsEndpoint = '/ecore/api/v2/endless-core/userdashboardmodules/?limit=-1';
  public modelsListEndpoint = '/ecore/api/v2/endless-core/dashboardmodules/?limit=-1';
  public error;

  constructor(
    private gfs: GenericFormService
  ) { }

  public getPages() {
    return this.gfs.getAll(this.endpoint).map(
      (res: any) => {
        if (res.results) {
          this.navigationList = res.results;
          return this.navigationList;
        }
      }
    );
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

}
