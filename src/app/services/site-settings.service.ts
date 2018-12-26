import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable()
export class SiteSettingsService {
  public endpoint: string;
  public siteEndpoint: string;
  public settings: any;
  public authorized: boolean;
  public currentEndpoint: string;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.endpoint = '/company_settings/';
    this.siteEndpoint = '/company_settings/site/';
  }

  public resolve() {
    if (this.authService.isAuthorized) {
      return this.userService
        .getUserData()
        .pipe(
          mergeMap((user: any) => {
            this.authorized = true;

            if (user.data.contact.contact_type === 'manager') {
              const update = this.currentEndpoint !== this.endpoint;

              return this.getSettings(this.endpoint, update);
            } else {
              return this.getSettings(this.siteEndpoint);
            }
          })
        );
    } else {
      return this.getSettings(this.siteEndpoint);
    }
  }

  public isSmsEnabled() {
    return this.settings.company_settings.sms_enabled;
  }

  public getCompanyName() {
    return this.settings.company_settings.company_name;
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
    document.body.parentElement.classList.add(
      `${this.getTheme(settings)}-theme`
    );
    document.body.style.fontFamily = `${this.getFont(settings) || 'Source Sans Pro'}, sans-serif`;
  }

  private getFont(settings: any): string {
    return (
      settings.font ||
      (settings.company_settings && settings.company_settings.font)
    );
  }

  private getTheme(settings: any): string {
    return (
      settings.color_scheme ||
      (settings.company_settings && settings.company_settings.color_scheme)
    );
  }
}
