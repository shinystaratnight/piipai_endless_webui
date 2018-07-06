import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { meta } from './company.meta';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { SettingsService } from '../settings.service';
import { SiteSettingsService } from '../../services';

@Component({
  selector: 'company',
  templateUrl: 'company.component.html'
})

export class CompanyComponent implements OnInit, OnDestroy {

  public endpoint: string = '/ecore/api/v2/company_settings/';

  public errors: any;
  public response: any;

  public currentTheme: string;
  public currentFont: string;

  public savedTheme: string;
  public savedFont: string;
  public saveProcess: boolean;

  public config;

  public companySettingsData: any;

  constructor(
    private gfs: GenericFormService,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private siteSettings: SiteSettingsService
  ) { }

  public ngOnInit() {
    this.route.url.subscribe((url) => {
      this.settingsService.url = <any> url;
    });
    this.gfs.getAll(this.endpoint).subscribe(
      (res: any) => {
        this.config = meta;
        this.fillingForm(this.config, res);
      },
      (err: any) => this.errors = err
    );
  }

  public ngOnDestroy() {
    this.resetSettings();
  }

  public resetSettings() {
    let body = document.body;
    body.parentElement.classList.remove(this.currentTheme);
    if (this.savedTheme) {
      body.parentElement.classList.add(`${this.savedTheme}-theme`);
    }
    if (this.savedFont) {
      let font = `${this.savedFont}, sans-serif`;
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
    let keys = key.split('.');
    let prop = keys.shift();
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
      let body = document.body;
      if (e.el.templateOptions.type === 'color') {
        body.parentElement.classList.remove(this.currentTheme);
        body.parentElement.classList.add(`${e.value}-theme`);
        this.currentTheme = `${e.value}-theme`;
      } else if (e.el.templateOptions.type === 'text') {
        let font = `${e.value}, sans-serif`;
        body.style.fontFamily = font;
        this.currentFont = e.value;
      }
    }
  }

}
