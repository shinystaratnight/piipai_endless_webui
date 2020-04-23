import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Endpoints } from '@webui/data';

interface CompanySettings {
  sms_enabled: boolean;
  company_name: string;
  company: string;
  color_scheme: string;
  advance_state_saving: boolean;
  font: string;
  country_code: string;
  [key: string]: any;
}

@Injectable()
export class SiteSettingsService {
  public settings: CompanySettings;
  public currentEndpoint: string;

  get companyId() {
    if (this.settings) {
      return this.settings.company;
    }
  }

  constructor(private http: HttpClient) {}

  public resolve() {
    return this.getSettings();
  }

  public isSmsEnabled(): boolean {
    return this.settings.sms_enabled || false;
  }

  public getCompanyName(): string {
    return this.settings.company_name || '';
  }

  public getSmsSendTitle() {
    return `SMS sending is disabled for ${this.getCompanyName()}, please contact your administrator.`;
  }

  private getSettings(): Observable<CompanySettings | boolean> {
    if (!this.settings) {
      return this.http.get<CompanySettings>(Endpoints.CompanySettings).pipe(
        tap(settings => {
          this.settings = settings;
          this.updateBrowserStyles(settings);
        }),
        map(settings => {
          if (settings.redirect_to) {
            location.href = settings.redirect_to;

            return false;
          }

          return settings;
        }),
        catchError(() => {
          return of(true);
        })
      );
    } else if (this.settings) {
      return of(this.settings);
    }
  }

  private updateBrowserStyles(settings: CompanySettings): void {
    const { body } = document;

    body.parentElement.classList.add(`${settings.color_scheme}-theme`);
    body.style.fontFamily = `${settings.font || 'Source Sans Pro'}, sans-serif`;
  }
}
