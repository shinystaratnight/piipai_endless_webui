import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { meta, payrollAccounts } from './myob.meta';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
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
  public saveProcess: boolean;

  public companyFile: any;
  public payrollAccounts: any;
  public accounts: any[];
  public MYOBSettings: any;
  public error: any;

  public keysOfPayroll: string[];
  public authData: any[];
  public myobApiKey: string;
  public connectProcess: boolean;
  public connectButton: any;

  constructor(
    private gfs: GenericFormService,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private router: Router,
    private location: Location,
  ) { }

  public ngOnInit() {
    this.keysOfPayroll = ['invoice', 'timesheet'];
    this.payrollAccounts = payrollAccounts;

    this.MYOBSettings = (<any> this.route.snapshot.data).myobSettings.myob_settings;
    this.parseMYOBSettings(this.MYOBSettings, moment);

    this.pageUrl = location.origin + location.pathname;

    this.route.url.subscribe((url) => {
      this.settingsService.url = <any> url;
    });

    this.route.queryParams.subscribe((params) => {
      let code = params['code'];
      if (code) {
        this.getMyobApiKey(() => {
          this.config = meta;
          this.saveInfo(code);
        });
      } else {
        this.config = meta;
        this.getAuthData();
        this.getCompanyFiles();
      }
    });

    this.companyFile = {
      isCollapsed: false,
      list: []
    };

    this.connectButton = {
      text: 'Connect'
    };
  }

  public getMyobApiKey(callback) {
    if (this.myobApiKey) {
      if (callback) {
        callback.apply(this);
      }
      return;
    }

    const endpoint = '/ecore/api/v2/company_settings/myob_api_key/';
    this.gfs.getAll(endpoint)
      .subscribe(
        (res) => {
          this.myobApiKey = res.api_key;

          if (callback) {
            callback.apply(this);
          }
        },
        (err: any) => this.error = err);
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

    this.keysOfPayroll.forEach((el) => {
      this.payrollAccounts[el].forEach((item) => {
        if (settings[item.key]) {
          if (item.options && item.options.length) {
            const field = item.options.find((option) => item.value === option.id);
            if (!field) {
              item.value = undefined;
            } else {
              item.value = settings[item.key].id;
            }
          } else {
            item.value = settings[item.key].id;
          }
        } else {
          item.value = undefined;
        }
      });
    });
  }

  public parseAccounts(data: any[], key: string = undefined): void {
    if (key) {
      this.payrollAccounts[key].forEach((el, i) => {
        if (i !== 0) {
          el.options = data;
          el.value = undefined;
        }
      });
    } else {
      this.keysOfPayroll.forEach((el: string) => {
        this.payrollAccounts[el].forEach((item, i) => {
          if (i !== 0) {
            item.options = data;
          }
        });
      });
    }
  }

  public eventHandler(e) {
    if (e.type === 'chenge' && e.list) {
      this.getCompanyFiles();
      this.authData = e.list;
    }
  }

  public connectHandler() {
    this.connectProcess = true;
    this.connect();
  }

  public connect() {
    this.getMyobApiKey(() => {
      const domain = 'https://secure.myob.com';
      const pathname = '/oauth2/account/authorize';
      const query = `?client_id=${this.myobApiKey}&redirect_uri=${this.pageUrl}&response_type=code&scope=CompanyFile`; //tslint:disable-line
      const url = domain + pathname + query;

      location.href = url;
    });
  }

  public saveInfo(code: string) {
    this.connectProcess = true;
    let url = `/ecore/api/v2/company_settings/myob_authorization/`;
    let body = {
      code,
      redirect_uri: this.pageUrl
    };
    this.gfs.submitForm(url, body).subscribe(
      (res: any) => {
        this.connectProcess = false;
        this.updateButton('success');
        this.getAuthData();
        this.router.navigate(['/settings/myob/']);
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
      this.getCompanyFiles();
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

  public updateMetadata(data, key) {
    let element = this.getElementByKey(data, key);
    data.forEach((el, i) => {
      if (el.key === key) {
        data.splice(i, 1, Object.assign({}, element));
      } else if (el.children) {
        this.updateMetadata(el.children, key);
      }
    });
  }

  public getAuthData() {
    const obj = this.getElementByKey(this.config, 'auth_data_list');
    this.gfs.getAll('/ecore/api/v2/company_settings/auth_data/')
      .finally(() => {
        this.updateMetadata(this.config, 'auth_data_list');
      })
      .subscribe((res) => {
        this.getValueOfData(res, 'auth_data_list', obj);
        this.authData = res.auth_data_list;
       }, (err: any) => this.error = err);
  }

  public getAccountsOfCompanyFile(id: string, key: string, files: boolean): void {
    if (files) {
      const field = key.split('_')[0];
      if (this.keysOfPayroll.indexOf(field) > -1) {
        let url = '/ecore/api/v2/company_settings/company_files/';
        this.gfs.getAll(`${url}${id}/accounts`).subscribe((res: any) => {
          this.parseAccounts(res.myob_accounts, field);
        }, );
      }
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
    this.keysOfPayroll.forEach((el) => {
      this.payrollAccounts[el].forEach((field) => {
        if (field.key === `${el}_company_file`) {
          field.options = list;
        }
      });
    });
    this.parseMYOBSettings(this.MYOBSettings, moment, true);
  }

  public updateButton(type) {
    this.connectProcess = false;
    if (type === 'success') {
      this.connectButton.text = 'Success';
      this.connectButton.color = '#5cb85c';
    } else {
      this.connectButton.text = 'Error';
      this.connectButton.color = '#d9534f';
    }
    setTimeout(() => {
      this.connectButton.text = 'Connect';
      this.connectButton.color = undefined;
    }, 3500);
  }

  public sendForm() {
    let url = '/ecore/api/v2/company_settings/myob_settings/';
    const data = {};
    this.keysOfPayroll.forEach((el) => {
      this.payrollAccounts[el].forEach((item) => {
        if (item.key !== el) {
          data[item.key] = {
            id: item.value
          };
        }
      });
    });
    this.resetErrors();
    this.saveProcess = true;
    this.gfs.submitForm(url, data).subscribe(
      (rse: any) => {
        this.saveProcess = false;
      },
      (err: any) => {
        this.saveProcess = false;
        this.parseError(err);
      }
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
      this.keysOfPayroll.forEach((el) => {
        this.payrollAccounts[el].forEach((item) => {
          if (err.errors[item.key]) {
            item.error = err.errors[item.key].id;
          }
        });
      });
    }
  }

  public resetErrors() {
    this.keysOfPayroll.forEach((el) => {
      this.payrollAccounts[el].forEach((item) => {
        item.error = null;
      });
    });
  }

  public reset() {
    this.getAccounts();
    this.parseMYOBSettings(this.MYOBSettings, moment, true);
  }

}
