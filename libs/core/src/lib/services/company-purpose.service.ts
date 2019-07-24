import { Injectable } from '@angular/core';
import { Endpoints } from '@webui/metadata';

export enum Purpose {
  Hire = 'hire',
  SelfUse = 'self_use',
  Recruitment = 'recruitment'
}

@Injectable()
export class CompanyPurposeService {

  public purpose: Purpose;

  public filterModules(modules: any[]) {
    switch(this.purpose) {
      case 'recruitment':
        return this.filterByEndpoint([Endpoints.Company, Endpoints.Job, Endpoints.CompanyContact], modules);
      case 'self_use':
        return this.filterByEndpoint([Endpoints.Company], modules);
      default:
        return modules;
    }
  }

  public filterNavigationByPurpose(purpose: Purpose, navigation: any[]) {
    switch(purpose) {
      case 'recruitment':
        return this.filterByName(['allocations', 'accounts'], navigation);
      case 'self_use':
        return this.filterByName(['clients'], navigation);
      default:
        return navigation;
    }
  }

  private filterByName(keys: string[], navigation) {
    return navigation.filter((el) => {
      let result = true;

      if (keys.includes(el.name.toLowerCase())) {
        result = false;
      }

      if (el.childrens && result) {
        el.childrens = this.filterByName(keys, el.childrens);
      }

      return result;
    });
  }

  private filterByEndpoint(endpoints: string[], modules) {
    return modules.filter((el) => {
      const { endpoint } = el.module_data;

      if (endpoints.includes(endpoint)) {
        return false;
      }

      return true;
    });
  }
}
