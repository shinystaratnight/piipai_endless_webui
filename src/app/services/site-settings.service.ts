import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';

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
    this.endpoint = '/company_settings/';
    this.siteEndpoint = '/company_settings/site/';
  }

  public resolve() {
    return this.userService
      .getUserData()
      .pipe(
        mergeMap((user: any) => {
          this.authorized = true;

          if (user.data.contact.contact_type === 'manager') {
            return this.getSettings(this.endpoint);
          } else {
            return this.getSettings(this.siteEndpoint);
          }
        }),
        catchError(() => {
          this.authorized = false;

          return this.getSettings(this.siteEndpoint);
        })
      );
  }

  private getSettings(endpoint: string): Observable<any> {
    if (!this.settings || !this.authorized) {
      return this.http
        .get(endpoint)
        .pipe(
          map((res: Response) => {
            const settings = res.json();

            if (this.authorized) {
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
    } else if (this.settings && this.authorized) {
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
