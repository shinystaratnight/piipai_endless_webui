import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserService } from './user.service';

@Injectable()
export class SiteSettingsService {

  public endpoint: string;
  public siteEndpoint: string;
  public settings: any;
  public authorized: boolean;

  constructor(
    private http: Http,
    private userService: UserService
  ) {
    this.endpoint = '/ecore/api/v2/company_settings/';
    this.siteEndpoint = '/ecore/api/v2/company_settings/site/';
  }

  public resolve() {
    return this.userService.getUserData()
      .mergeMap(
        (user: any) => {
          this.authorized = true;

          if (user.data.contact.contact_type === 'manager') {
            return this.getSettings(this.endpoint);
          } else {
            return this.getSettings(this.siteEndpoint);
          }
        })
      .catch((err: any) => {
        this.authorized = false;

        return this.getSettings(this.siteEndpoint);
      });
  }

  private getSettings(endpoint: string): Observable<any> {
    if (!this.settings || !this.authorized) {
      return this.http.get(endpoint)
        .map((res: Response) => {
          const settings = res.json();

          if (this.authorized) {
            this.settings = settings;
          }

          setTimeout(() => {
            this.updateBrowserStyles(settings);
          }, 100);

          return settings;
        })
        .catch((err: any) => Observable.of(true));
    } else if (this.settings && this.authorized) {
      return Observable.of(this.settings);
    }
  }

  private updateBrowserStyles(settings: any) {
    document.body.parentElement.classList.add(`${this.getTheme(settings)}-theme`);
    document.body.style.fontFamily = `${this.getFont(settings)}, sans-serif`;
  }

  private getFont(settings: any): string {
    return settings.font
      || settings.company_settings
      && settings.company_settings.font;
  }

  private getTheme(settings: any): string {
    return settings.color_scheme
      || settings.company_settings
      && settings.company_settings.color_scheme;
  }

}
