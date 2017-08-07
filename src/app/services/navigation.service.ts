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

  public navigationList: any[];
  public endpoint = '/ecore/api/v2/endless-core/extranetnavigations/';
  public error;

  constructor(
    private gfs: GenericFormService
  ) { }

  public getPages() {
    if (!this.navigationList) {
      return this.gfs.getAll(this.endpoint).map(
        (res: any) => {
          this.navigationList = res.results;
          return this.navigationList;
        },
        (err: any) => this.error = err
      );
    } else {
      return Observable.of(this.navigationList);
    }
  }

}
