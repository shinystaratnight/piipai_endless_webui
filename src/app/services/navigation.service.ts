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
  public endpoint = '/ecore/api/v2/endless-core/extranetnavigations/';
  public userModelsEndpoint = '/ecore/api/v2/endless-core/userdashboardmodules/';
  public modelsListEndpoint = '/ecore/api/v2/endless-core/dashboardmodules/';
  public error;

  constructor(
    private gfs: GenericFormService
  ) { }

  public getPages() {
    return this.getModules().map(
      (models: any) => {
        return this.getUserModules().map(
          (usermodels: any) => {
            return this.gfs.getAll(this.endpoint).map(
              (res: any) => {
                if (res.results) {
                  this.navigationList = this.filterNavigation(res.results, usermodels, models);
                  return this.navigationList;
                }
              }
            );
          }
        );
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

  public filterNavigation(pages, userModels, models) {
    let endpointsList = [];
    userModels.forEach((el) => {
      if (el && el.dashboard_module) {
        let model = models.filter((elem) => {
          if (elem === el.dashboard_module.id) {
            return true;
          } else {
            return false;
          }
        });
        if (model.length) {
          let appName = model[0].module_data.app.replace(/_/, '-');
          let modelName = model[0].module_data.plural_name.split(' ').join('').toLowerCase();
          let endpoint = `/ecore/api/v2/${appName}/${modelName}/`;
          endpointsList.push(endpoint);
        }
      }
    });
    this.removePages(pages, endpointsList);
    return pages;
  }

  public removePages(pages, endpoints) {
    pages.forEach((el, i) => {
      if (endpoints.indexOf(el.endpoint) > -1) {
        if (el.childrens && el.childrens.length) {
          this.removePages(el.childrens, endpoints);
        }
      } else {
        pages.splice(i, 1);
      }
    });
  }

}
