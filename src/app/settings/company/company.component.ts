import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { meta } from './company.meta';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { SettingsService } from '../settings.service';
import { SiteSettingsService } from '../../services';

@Component({
  selector: 'app-company',
  templateUrl: 'company.component.html'
})

export class CompanyComponent implements OnInit, OnDestroy {

  public endpoint = '/company_settings/';

  public errors: any;
  public response: any;

  public currentTheme: string;
  public currentFont: string;

  public savedTheme: string;
  public savedFont: string;
  public saveProcess: boolean;

  public config;

  public companySettingsData: any;

  public company: string;

  public urlSubscription: Subscription;

  constructor(
    private gfs: GenericFormService,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private siteSettings: SiteSettingsService
  ) { }

  public ngOnInit() {
    this.urlSubscription = this.route.url.subscribe((url) => {
      this.settingsService.url = <any> url;
    });
    this.gfs.getAll(this.endpoint).subscribe(
      (res: any) => {
        this.config = meta;
        this.fillingForm(this.config, res);
        this.company = res.company_settings.company;
      },
      (err: any) => this.errors = err
    );
  }

  public ngOnDestroy() {
    this.urlSubscription.unsubscribe();
    this.resetSettings();
  }

  public resetSettings() {
    const body = document.body;
    body.parentElement.classList.remove(this.currentTheme);
    if (this.savedTheme) {
      body.parentElement.classList.add(`${this.savedTheme}-theme`);
    }
    if (this.savedFont) {
      const font = `${this.savedFont}, sans-serif`;
      body.style.fontFamily = font;
    } else {
      body.style.fontFamily = null;
    }
  }

  public submitForm(data) {
    this.saveProcess = true;
    this.gfs.submitForm(this.endpoint, data).subscribe(
      (res: any) => {
        this.siteSettings.settings = data;
        this.saveProcess = false;
        this.savedTheme = null;
        this.savedFont = null;
      },
      (err: any) => {
        this.saveProcess = false;
        this.errors = err;
      }
    );
  }

  public fillingForm(metadata, data) {
    metadata.forEach((el) => {
      if (el.key) {
        this.getValueOfData(data, el.key, el);
      } else if (el.children) {
        this.fillingForm(el.children, data);
      }
    });
  }

  public getValueOfData(data, key, obj) {
    const keys = key.split('.');
    const prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        obj['value'] = data[key];
        if (key === 'color_scheme') {
          this.currentTheme = `${data[key]}-theme`;
          this.savedTheme = data[key];
        }
        if (key === 'font') {
          this.savedFont = data[key];
        }
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj);
      }
    }
  }

  public eventHandler(e) {
    if (e.type === 'change' && e.el.type === 'radio' && e.value) {
      const body = document.body;
      if (e.el.templateOptions.type === 'color') {
        body.parentElement.classList.remove(this.currentTheme);
        body.parentElement.classList.add(`${e.value}-theme`);
        this.currentTheme = `${e.value}-theme`;
      } else if (e.el.templateOptions.type === 'text') {
        const font = `${e.value}, sans-serif`;
        body.style.fontFamily = font;
        this.currentFont = e.value;
      }
    }
  }

}
