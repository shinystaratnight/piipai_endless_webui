import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { GenericFormService } from '../../dynamic-form/services/generic-form.service';

@Component({
  selector: 'company',
  templateUrl: 'company.component.html'
})

export class CompanyComponent implements OnInit {

  public endpoint: string = '/ecore/api/v2/company_settings/';

  public errors: any;
  public response: any;

  public config = [
    {
      type: 'picture',
      key: 'logo',
      read_only: false,
      templateOptions: {
        label: 'Logo',
        label_upload: 'Choose a file',
        type: 'file',
        required: false,
      }
    },
    {
      type: 'related',
      key: 'company',
      read_only: false,
      endpoint: '/ecore/api/v2/core/companies/',
      templateOptions: {
        label: 'Company',
        required: true,
        display: '__str__',
        param: 'id'
      }
    },
    {
      type: 'input',
      key: 'font',
      templateOptions: {
        max: 32,
        label: 'Font',
        type: 'text',
      }
    },
    {
      type: 'input',
      key: 'color_scheme',
      templateOptions: {
        max: 32,
        label: 'Color scheme',
        type: 'text',
      }
    },
    {
      type: 'input',
      key: 'forwarding_number',
      templateOptions: {
        max: 32,
        label: 'Forwarding number',
        type: 'text',
      }
    }
  ];

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
        }
        if (obj.type === 'related') {
          obj.options = [];
        }
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj, metadata);
      }
    }
  }

}
