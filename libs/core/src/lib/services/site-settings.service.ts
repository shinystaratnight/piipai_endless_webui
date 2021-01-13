import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Endpoints, CountryCodeLanguage, Language } from '@webui/data';
import { TranslateHelperService } from './translate-helper-service';

interface CompanySettings {
  sms_enabled: boolean;
  company_name: string;
  company: string;
  color_scheme: string;
  advance_state_saving: boolean;
  font: string;
  country_code: string;
  currency: string;
  [key: string]: any;
}

@Injectable()
export class SiteSettingsService {
  settings: CompanySettings;

  get companyId() {
    if (this.settings) {
      return this.settings.company;
    }
  }

  constructor(
    private http: HttpClient,
    private translate: TranslateHelperService
  ) {}

  resolve() {
    return this.getSettings();
  }

  isSmsEnabled(): boolean {
    return this.settings.sms_enabled || false;
  }

  getCompanyName(): string {
    return this.settings.company_name || '';
  }

  getSmsSendTitle() {
    return `SMS sending is disabled for ${this.getCompanyName()}, please contact your administrator.`;
  }

  private getSettings(): Observable<CompanySettings> {
    if (!this.settings) {
      return this.http.get<CompanySettings>(Endpoints.CompanySettings).pipe(
        tap((settings) => {
          this.settings = settings;

          if (!settings.country_code) {
            settings.country_code = 'GB';
          }

          this.updateBrowserStyles(settings);
        }),
        tap((settings) => this.updateLanguage(settings)),
        map((settings) => {
          if (settings.redirect_to) {
            location.href = settings.redirect_to;

            return {} as CompanySettings;
          }

          return settings;
        }),
        catchError(() => {
          return of({} as CompanySettings);
        })
      );
    } else if (this.settings) {
      return of(this.settings).pipe(
        tap((settings) => this.updateLanguage(settings))
      );
    }
  }

  private updateBrowserStyles(settings: CompanySettings): void {
    const { body } = document;
    const themeClass = `${settings.color_scheme}-theme`;
    const fontFamily = `${settings.font || 'Source Sans Pro'}, sans-serif`;

    // TODO: refactor it
    body.parentElement.classList.add(themeClass);
    body.style.fontFamily = fontFamily;
  }

  private updateLanguage(settings: CompanySettings): void {
    const isManager = location.pathname.includes('/mn');
    const companyLang = CountryCodeLanguage[settings.country_code];
    const lang = isManager
      ? Language.English
      : this.translate.currentLang !== companyLang
      ? companyLang
      : Language.English;

    if (!lang) {
      this.translate.setLang(Language.English);
    } else {
      this.translate.setLang(lang);
    }
  }
}
