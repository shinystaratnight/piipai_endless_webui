import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { meta } from './company.meta';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

@Component({
  selector: 'company',
  templateUrl: 'company.component.html'
})

export class CompanyComponent implements OnInit {

  public endpoint: string = '/ecore/api/v2/company_settings/';

  public errors: any;
  public response: any;

  public currentTheme: string;
  public currentFornt: string;

  public config = meta;

  public companySettingsData: any;

  constructor(
    private gfs: GenericFormService,
  ) { }

  public ngOnInit() {
    this.gfs.getAll(this.endpoint).subscribe(
      (res: any) => this.fillingForm(this.config, res),
      (err: any) => this.errors = err
    );
  }

  public submitForm(data) {
    this.gfs.submitForm(this.endpoint, data).subscribe(
      (res: any) => this.response = res,
      (err: any) => this.errors = err
    );
  }

  public fillingForm(metadata, data) {
    metadata.forEach((el) => {
      if (el.key) {
        this.getValueOfData(data, el.key, el, metadata);
      } else if (el.children) {
        this.fillingForm(el.children, data);
      }
    });
  }

  public getValueOfData(data, key, obj, metadata) {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        if (!obj['value']) {
          obj['value'] = data[key];
          if (key === 'color_scheme') {
            this.currentTheme = data[key];
          }
        }
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj, metadata);
      }
    }
  }

  public eventHandler(e) {
    if (e.type === 'change' && e.el.type === 'radio') {
      let body = document.body;
      if (e.el.templateOptions.type === 'color') {
        body.classList.remove(this.currentTheme);
        body.classList.add(`${e.value}-theme`);
        this.currentTheme = `${e.value}-theme`;
      } else if (e.el.templateOptions.type === 'text') {
        let font = `${e.value}, sans-serif`;
        body.style.fontFamily = font;
        this.currentFornt = e.value;
      }
    }
  }

}
