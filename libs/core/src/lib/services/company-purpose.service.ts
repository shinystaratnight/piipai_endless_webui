import { Injectable } from '@angular/core';

import { Endpoints, Purpose } from '@webui/data';

@Injectable()
export class CompanyPurposeService {

  public purpose: Purpose;

  hideListColumns = {
    [Endpoints.Skill]: {
      [Purpose.SelfUse]: ['price_list_default_rate'],
      [Purpose.Recruitment]: ['price_list_default_rate']
    }
  }

  public filterModules(modules: any[]) {
    switch(this.purpose) {
      case Purpose.Recruitment:
        return this.filterByEndpoint([Endpoints.Company, Endpoints.Job, Endpoints.CompanyContact], modules);
      case Purpose.SelfUse:
        return this.filterByEndpoint([Endpoints.Company], modules);
      default:
        return modules;
    }
  }

  public filterNavigationByPurpose(purpose: Purpose, navigation: any[]) {
    switch(purpose) {
      case Purpose.Recruitment:
        return this.filterByName(['allocations', 'accounts'], navigation);
      case Purpose.SelfUse:
        return this.filterByName(['clients'], navigation);
      default:
        return navigation;
    }
  }

  public filterListColumns(endpoint: string, columns: any[]) {
    const hideColumns: string[] = this.hideListColumns[endpoint];

    if (hideColumns && hideColumns[this.purpose]) {
      return columns.filter((column) => {
        return !hideColumns[this.purpose].includes(column.name);
      });
    }

    return columns;
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
