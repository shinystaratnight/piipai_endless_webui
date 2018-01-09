import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { meta, payrollAccounts } from './myob.meta';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Field } from '../../dynamic-form/models/field.model';
import { SettingsService } from '../settings.service';

import moment from 'moment-timezone';

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
  public accounts: any[];
  public MYOBSettings: any;
  public error: any;

  constructor(
    private gfs: GenericFormService,
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    private settingsService: SettingsService
  ) { }

  public ngOnInit() {
    this.payrollAccounts = payrollAccounts;
    const routeData: any = this.route.snapshot.data;
    this.MYOBSettings = routeData.myobSettings.myob_settings;
    this.parseMYOBSettings(this.MYOBSettings, moment);

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
      isCollapsed: false
    };

    this.getCompanyFiles();
  }

  public parseMYOBSettings(settings, moment, reset = undefined) {
    if (!reset) {
      settings.payroll_accounts_last_refreshed = settings.payroll_accounts_last_refreshed ?
        moment.tz(settings.payroll_accounts_last_refreshed, 'Australia/Sydney')
              .format('DD/MM/YYYY hh:mm A') : '';
      settings.company_files_last_refreshed = settings.company_files_last_refreshed ?
        moment.tz(settings.company_files_last_refreshed, 'Australia/Sydney')
          .format('DD/MM/YYYY hh:mm A') : '';
    }

    const keys = ['subcontractor', 'candidate', 'company_client'];
    keys.forEach((el) => {
      this.payrollAccounts[el].forEach((item) => {
        if (settings[item.key]) {
          item.value = settings[item.key].id;
        }
      });
    });
  }

  public parseAccounts(data: any[], key: string = undefined): void {
    if (key) {
      this.payrollAccounts[key].forEach((el, i) => {
        if (i !== 0) {
          el.options = data;
        }
      });
    } else {
      const keys = ['subcontractor', 'candidate', 'company_client'];
      keys.forEach((el: string) => {
        this.payrollAccounts[el].forEach((item, i) => {
          if (i !== 0) {
            item.options = data;
          }
        });
      });
    }
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
    const url = '/ecore/api/v2/company_settings/company_files/check/';
    const body = {
      id: file.id,
      username: file.username,
      password: file.password
    };
    this.gfs.submitForm(url, body).subscribe((res: any) => {
      file.authenticated = res.is_valid;
    }, (err: any) => this.error = err);
  }

  public getCompanyFiles() {
    const url = '/ecore/api/v2/company_settings/company_files/';
    this.gfs.getAll(url).subscribe((res: any) => {
      this.companyFile.list = res.company_files;
      this.companyFile.list.forEach((el) => {
        el.username = '';
        el.password = '';
      });
      this.companyFile.isCollapsed = false;
      this.filledCompanyFiles(this.companyFile.list);

      this.getAccounts();
    }, (err: any) => this.error = err);
  }

  public refreshCompanyFiles() {
    const url = '/ecore/api/v2/company_settings/company_files/refresh/';
    this.gfs.getAll(url).subscribe((res: any) => {
      this.companyFile.list = res.company_files;
      this.companyFile.list.forEach((el) => {
        el.username = '';
        el.password = '';
      });
      this.companyFile.isCollapsed = false;
      this.filledCompanyFiles(this.companyFile.list);
      this.getMYOBSettings();
    }, (err: any) => this.error = err);
  }

  public getAccounts(refresh = false) {
    let url = '/ecore/api/v2/company_settings/myob_accounts/';
    if (refresh) {
      url += 'refresh/';
    }
    this.gfs.getAll(url).subscribe((res: any) => {
      if (res && res.myob_accounts) {
        this.accounts = res.myob_accounts;
      }
      this.parseAccounts(this.accounts);
      if (refresh) {
        this.getMYOBSettings();
      }
    }, (err: any) => this.error = err);
  }

  public getAccountsOfCompanyFile(id: string, key: string): void {
    const keys = ['subcontractor', 'candidate', 'company_client'];
    if (keys.indexOf(key) > -1) {
      let url = '/ecore/api/v2/company_settings/company_files/';
      this.gfs.getAll(`${url}${id}/accounts`).subscribe((res: any) => {
        this.parseAccounts(res, key);
      }, (err: any) => this.error = err);
    }
  }

  public getMYOBSettings() {
    let url = '/ecore/api/v2/company_settings/myob_settings/';
    this.gfs.getAll(url).subscribe((res: any) => {
      this.MYOBSettings = res.myob_settings;
      this.parseMYOBSettings(this.MYOBSettings, moment);
    }, (err: any) => this.error = err);
  }

  public filledCompanyFiles(list: any[]) {
    const keys = ['subcontractor', 'candidate', 'company_client'];
    keys.forEach((el) => {
      this.payrollAccounts[el].forEach((field) => {
        if (field.key === el) {
          field.options = list;
        }
      });
    });
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

  public sendForm() {
    let url = '/ecore/api/v2/company_settings/myob_settings/';
    const data = {};
    const keys = ['subcontractor', 'candidate', 'company_client'];
    keys.forEach((el) => {
      this.payrollAccounts[el].forEach((item) => {
        if (item.key !== el) {
          data[item.key] = {
            id: item.value
          };
        }
      });
    });
    this.resetErrors();
    this.gfs.submitForm(url, data).subscribe(undefined,
      (err: any) => this.parseError(err)
    );
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

  public parseError(err) {
    if (err && err.errors) {
      const keys = ['subcontractor', 'candidate', 'company_client'];
      keys.forEach((el) => {
        this.payrollAccounts[el].forEach((item) => {
          if (err.errors[item.key]) {
            item.error = err.errors[item.key].id;
          }
        });
      });
    }
  }

  public resetErrors() {
    const keys = ['subcontractor', 'candidate', 'company_client'];
    keys.forEach((el) => {
      this.payrollAccounts[el].forEach((item) => {
        item.error = null;
      });
    });
  }

  public reset() {
    this.parseMYOBSettings(this.MYOBSettings, moment, true);
  }

}
