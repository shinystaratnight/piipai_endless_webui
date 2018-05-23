import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserService } from './user.service';

@Injectable()
export class SettingsService {

  public endpoint: string = '/ecore/api/v2/company_settings/';
  public siteEndpoint: string = '/ecore/api/v2/company_settings/site/';

  constructor(
    private http: Http,
    private userService: UserService
  ) { }

  public resolve() {
    return this.userService.getUserData()
      .mergeMap(
        (user: any) => {
          if (user.data.contact.contact_type === 'manager') {
            return this.getSettings(this.endpoint);
          } else {
            return this.getSettings(this.siteEndpoint);
          }
        })
      .catch((err: any) => {
        return this.getSettings(this.siteEndpoint);
      });
  }

  private getSettings(endpoint: string): Observable<any> {
    return this.http.get(endpoint)
      .map((res: Response) => {
        let settings = res.json();
        setTimeout(() => {
          let body = document.body;
          body.parentElement.classList.add(`${settings.color_scheme || settings.company_settings && settings.company_settings.color_scheme}-theme`); //tslint:disable-line
          body.style.fontFamily = `${settings.font || (settings.company_settings && settings.company_settings.font)}, sans-serif`;
        }, 700);
        return res.json();
      })
      .catch((err: any) => Observable.of(true));
  }

}
