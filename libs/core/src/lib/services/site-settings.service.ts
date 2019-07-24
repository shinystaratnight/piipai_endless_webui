import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { isManager } from '@webui/utilities';

@Injectable()
export class SiteSettingsService {
  public endpoint = '/company_settings/';
  public siteEndpoint = '/company_settings/site/';

  public settings: any;
  public authorized: boolean;
  public currentEndpoint: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public resolve() {
    if (this.authService.isAuthorized && isManager()) {
      const update = this.currentEndpoint !== this.endpoint;

      return this.getSettings(this.endpoint, update);
    }

    return this.getSettings(this.siteEndpoint);
  }

  public isSmsEnabled(): boolean {
    const { company_settings } = this.settings;

    return company_settings ? company_settings.sms_enabled : false;
  }

  public getCompanyName(): string {
    const { company_settings } = this.settings;

    return company_settings ? company_settings.company_name : '';
  }

  public getSmsSendTitle() {
    return `SMS sending is disabled for ${this.getCompanyName()}, please contact your administrator.`;
  }

  private getSettings(endpoint: string, update?: boolean): Observable<any> {
    this.currentEndpoint = endpoint;

    if (!this.settings || !this.authService.isAuthorized || update) {
      return this.http
        .get(endpoint)
        .pipe(
          map((settings: any) => {
            if (this.authService.isAuthorized) {
              this.settings = settings;
            }

            if (settings.redirect_to) {
              location.href = settings.redirect_to;

              return of(true);
            }

            setTimeout(() => {
              this.updateBrowserStyles(settings);
            }, 100);

            return settings;
          }),
          catchError(() => {
            return of(true);
          })
        );
    } else if (this.settings && this.authService.isAuthorized) {
      return of(this.settings);
    }
  }

  private updateBrowserStyles(settings: any): void {
    const { body } = document;

    body.parentElement.classList.add(`${this.getTheme(settings)}-theme`);
    body.style.fontFamily = `${this.getFont(settings) || 'Source Sans Pro'}, sans-serif`;
  }

  private getFont(settings: any): string {
    const { font, company_settings } = settings;

    return font || (company_settings && company_settings.font);
  }

  private getTheme(settings: any): string {
    const { color_scheme, company_settings } = settings;

    return color_scheme || (company_settings && company_settings.color_scheme);
  }
}
