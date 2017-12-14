import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { meta } from './myob.meta';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Field } from '../../dynamic-form/models/field.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'myob',
  templateUrl: 'myob.component.html'
})

export class MyobComponent implements OnInit {

  public endpoint: string = '/ecore/api/v2/company_settings/';
  public pageUrl: string;
  public errors: any;
  public response: any;
  public config;
  public connected: boolean;

  public companyFile: any;
  public payrollAccounts: any;
  public error: any;

  constructor(
    private gfs: GenericFormService,
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    private settingsService: SettingsService
  ) { }

  public ngOnInit() {
    this.pageUrl = location.origin + location.pathname;
    this.route.url.subscribe((url) => {
      this.settingsService.url = <any> url;
    });
    this.route.queryParams.subscribe((params) => {
      let code = params['code'];
      if (code) {
        let key = this.storage.retrieve('key');
        let secret = this.storage.retrieve('secret');
        if (code && key && secret) {
          let data = { key, secret };
          this.fillingForm(meta, data);
          this.config = meta;
          this.saveInfo(code, key, secret);
        } else {
          this.storage.clear('key');
          this.storage.clear('secret');
          this.config = meta;
        }
      } else {
        this.config = meta;
      }
    });

    this.companyFile = {
      isCollapsed: true
    };

    this.payrollAccounts = {
      isCollapsed: true,
      subcontractor: [
        {
          label: 'Subcontractor',
          value: '',
          key: 'subcontractor'
        },
        {
          label: 'Contract work',
          value: '',
          key: 'subcontractor_contract_work'
        }, {
          label: 'GST',
          value: '',
          key: 'subcontractor_gst'
        }
      ],
      candidate: [
        {
          label: 'Cadidate',
          value: '',
          key: 'candidate',
          options: []
        },
        {
          label: 'Wages and Salries',
          value: '',
          key: 'candidate_wages'
        },
        {
          label: 'Superannuation',
          value: '',
          key: 'candidate_superannuation'
        }
      ],
      company_client: [
        {
          label: 'Company Client',
          value: '',
          key: 'company_client'
        },
        {
          label: 'Labour hire services',
          value: '',
          key: 'company_client_labour_hire'
        },
        {
          label: 'GST',
          value: '',
          key: 'company_client_gst'
        },
      ]
    };
  }

  public eventHandler(e) {
    if (e.type === 'blur') {
      if (e.el.key === 'key') {
        this.storage.store('key', e.value);
      } else if (e.el.key === 'secret') {
        this.storage.store('secret', e.value);
      }
    }
  }

  public buttonHandler(e) {
    if (e.type === 'click' && e.value && !this.connected) {
      this[e.value]();
    }
  }

  public connect() {
    let key = this.storage.retrieve('key');
    if (key && this.pageUrl) {
      const domain = 'https://secure.myob.com';
      const pathname = '/oauth2/account/authorize';
      const query =
        `?client_id=${key}&redirect_uri=${this.pageUrl}&response_type=code&scope=CompanyFile`;
      const url = domain + pathname + query;
      location.href = url;
    }
  }

  public saveInfo(code, key, secret) {
    let url = `/ecore/api/v2/company_settings/myob_authorization/`;
    let body = {
      code,
      api_key: key,
      api_secret: secret,
      redirect_uri: this.pageUrl
    };
    this.gfs.submitForm(url, body).subscribe(
      (res: any) => {
        this.updateButton('success');
        this.connected = true;
        this.getCompanyFiles();
      },
      (err: any) => this.updateButton('error')
    );
  }

  public testCompanyFile(file) {
    const url = '/api/v2/company_settings/company_files/check/';
    const body = {
      id: file.id,
      username: file.username,
      password: file.password
    };
    this.gfs.submitForm(url, body).subscribe((res: any) => {
      file.status = res.is_valid;
    }, (err: any) => this.error = err);
  }

  public getCompanyFiles() {
    const url = '/api/v2/company_settings/company_files/';
    this.gfs.getAll(url).subscribe((res: any) => {
      this.companyFile.list = res;
      this.companyFile.isCollapsed = false;
    }, (err: any) => this.error = err);
  }

  public refreshCompanyFiles() {
    const url = '/api/v2/company_settings/company_files/refresh/';
    this.gfs.getAll(url).subscribe((res: any) => {
      this.companyFile.list = res;
      this.companyFile.isCollapsed = false;
    }, (err: any) => this.error = err);
  }

  public updateButton(type) {
    let connectButton = this.getElementByKey(this.config, 'connect');
    if (connectButton) {
      if (type === 'success') {
        connectButton.templateOptions.text = 'Success';
        connectButton.color = '#5cb85c';
      } else {
        connectButton.templateOptions.text = 'Error';
        connectButton.color = '#d9534f';
        setTimeout(() => {
          connectButton.templateOptions.text = 'Connect';
          connectButton.color = undefined;
        }, 3500);
      }
    }
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

  public getValueOfData(data, key: string, obj: Field): void {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        if (!obj['value']) {
          obj['value'] = data[key];
        }
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj);
      }
    }
  }

  public getElementByKey(metadata, key) {
    let result;
    metadata.forEach((el) => {
      if (el.key === key) {
        result = el;
      } else if (el.children) {
        result = this.getElementByKey(el.children, key);
      }
    });
    return result;
  }

}
