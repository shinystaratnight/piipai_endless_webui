import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { meta, payrollAccounts } from './myob.meta';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { Field } from '../../dynamic-form/models/field.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'myob',
  templateUrl: 'myob.component.html'
})

export class MyobComponent implements OnInit, OnDestroy {

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

  public querySubscription: Subscription;
  public urlSubscription: Subscription;

  constructor(
    private gfs: GenericFormService,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private router: Router,
  ) { }

  public ngOnInit() {
    this.payrollAccounts = payrollAccounts;

    this.MYOBSettings = (<any> this.route.snapshot.data).myobSettings.myob_settings;
    this.parseMYOBSettings(this.MYOBSettings);

    this.pageUrl = location.origin + location.pathname;

    this.urlSubscription = this.route.url.subscribe((url) => {
      this.settingsService.url = <any> url;
    });

    this.querySubscription = this.route.queryParams.subscribe((params) => {
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

  public ngOnDestroy() {
    this.urlSubscription.unsubscribe();
    this.querySubscription.unsubscribe();
  }

  public getMyobApiKey(callback) {
    if (this.myobApiKey) {
      if (callback) {
        callback.apply(this);
      }
      return;
    }

    const endpoint = '/ecore/api/v2/company_settings/myob_api_key/';
    this.gfs
      .getAll(endpoint)
      .subscribe(
        (res) => {
          this.myobApiKey = res.api_key;

          if (callback) {
            callback.apply(this);
          }
        },
        (err: any) => this.error = err
      );
  }

  public parseMYOBSettings(settings) {
    settings = JSON.parse(JSON.stringify(settings));

    Object.keys(this.payrollAccounts).forEach((el) => {
      if (settings[el]) {
        this.payrollAccounts[el].value = settings[el].id;
        if (el === 'invoice_activity_account') {
          if (this.companyFile) {
            this.getAccountsOfCompanyFile(
              settings['invoice_company_file'].id,
              'invoice_activity_account',
              settings[el].id
            );
          }
        }
      } else {
        if (this.payrollAccounts[el] instanceof Object) {
          this.payrollAccounts[el].value = '';
        }
      }
    });
  }

  public parseAccounts(data: any[], key: string = undefined, value?: string): void {
    if (key) {
      this.payrollAccounts[key].options = data;
      this.payrollAccounts[key].value = value || '';
    } else {
      Object.keys(this.payrollAccounts).forEach((el: string) => {
        if (el.indexOf('_account') > -1) {
          this.payrollAccounts[el].options = data;
        }
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
      const query = `?client_id=${this.myobApiKey}&redirect_uri=http://r3sourcer.com/myob/oauth2_redirect_uri&response_type=code&scope=CompanyFile&state=${this.pageUrl}`; //tslint:disable-line
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
      id: file.cf_id,
      username: file.username,
      password: file.password
    };
    this.gfs.submitForm(url, body).subscribe((res: any) => {
      file.authenticated = res.is_valid;
    }, (err: any) => this.error = err);
  }

  public getCompanyFiles() {
    const url = '/ecore/api/v2/company_settings/company_files/';

    this.gfs
      .getAll(url)
      .subscribe(
        (res: any) => {
          this.companyFile.list = res.company_files;
          this.companyFile.list.forEach((el) => {
            el.username = '';
            el.password = '';
          });
          this.companyFile.isCollapsed = false;
          this.filledCompanyFiles(this.companyFile.list);
        },
        (err: any) => this.error = err
      );
  }

  public refreshCompanyFiles() {
    const url = '/ecore/api/v2/company_settings/company_files/refresh/';
    this.gfs
      .getAll(url)
      .subscribe(
        (res: any) => {
          this.getCompanyFiles();
          this.refreshTime('company_files_last_refreshed');
        },
        (err: any) => this.error = err
      );
  }

  public refreshAccounts() {
    const companyFile = this.companyFile.list.find((el) => {
      return el.id === this.payrollAccounts['invoice_company_file'].value;
    });

    if (companyFile) {
      const id = companyFile.cf_id;
      const url = `/ecore/api/v2/company_settings/company_files/${id}/accounts/refresh/`;

      this.gfs
        .getAll(url)
        .subscribe(
          (res: any) => {
            this.getAccountsOfCompanyFile(
              companyFile.id,
              'invoice_activity_account',
              this.payrollAccounts['invoice_activity_account'].value
            );
            this.refreshTime('payroll_accounts_last_refreshed');
          },
          (err: any) => this.error = err
        );
    }
  }

  public refreshTime(field: string) {
    let url = '/ecore/api/v2/company_settings/myob_settings/';
    this.gfs
      .getAll(url)
      .subscribe(
        (res: any) => {
          this.MYOBSettings[field] = res.myob_settings[field];
        },
        (err: any) => this.error = err
      );
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

    this.gfs
      .getAll('/ecore/api/v2/company_settings/auth_data/')
      .finally(() => {
        this.updateMetadata(this.config, 'auth_data_list');
      })
      .subscribe(
        (res) => {
          this.getValueOfData(res, 'auth_data_list', obj, 'options');
          this.getValueOfData(res, 'auth_data_list', obj);
          this.authData = res.auth_data_list;
        },
        (err: any) => this.error = err
      );
  }

  public getAccountsOfCompanyFile(id: string, key: string, value?: string): void {
    const url = '/ecore/api/v2/company_settings/company_files/';
    const companyFile = this.companyFile.list.find((el) => el.id === id);

    if (companyFile) {
      this.gfs
        .getAll(`${url}${companyFile.cf_id}/accounts/`)
        .subscribe(
          (res: any) => {
            const accounts = res.myob_accounts.filter((el) => el.type.toLowerCase() === 'income');

            this.parseAccounts(accounts, key, value);
          }
        );
    } else {
      this.parseAccounts([], key);
    }
  }

  public getMYOBSettings() {
    const url = '/ecore/api/v2/company_settings/myob_settings/';

    this.gfs
      .getAll(url)
      .subscribe(
        (res: any) => {
          this.MYOBSettings = res.myob_settings;
          this.parseMYOBSettings(this.MYOBSettings);
        },
        (err: any) => this.error = err
      );
  }

  public filledCompanyFiles(list: any[]) {
    Object.keys(this.payrollAccounts).forEach((el) => {
      if (el.indexOf('_company_file') > -1) {
        this.payrollAccounts[el].options = list;
      }
    });
    this.parseMYOBSettings(this.MYOBSettings);
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

  public sendForm(form) {
    let url = '/ecore/api/v2/company_settings/myob_settings/';
    const data = {};
    Object.keys(form).forEach((key) => {
      if (key.indexOf('company_file') > -1) {
        const file = this.companyFile.list.find((item) => item.id === form[key]);
        if (file) {
          data[key] = {
            id: file.cf_id
          };
        }
      } else {
        data[key] = {
          id: form[key]
        };
      }
    });

    this.resetErrors();
    this.saveProcess = true;
    this.gfs.submitForm(url, data).subscribe(
      () => {
        this.saveProcess = false;
      },
      (err: any) => {
        this.saveProcess = false;
        this.parseError(err);
      }
    );
  }

  public getValueOfData(data, key: string, obj: Field, param?: string): void {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        if (param) {
          if (!obj[param]) {
            obj[param] = data[key];
          }
        } else {
          if (!obj['value']) {
            obj['value'] = data[key];
          }
        }
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj, param);
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
      Object.keys(this.payrollAccounts).forEach((el) => {
        if (err.errors[el]) {
          this.payrollAccounts[el].error = Object.keys(err.errors[el])
            .map((key) => err.errors[el][key]);
        }
      });
    }
  }

  public resetErrors() {
    Object.keys(this.payrollAccounts).forEach((el) => {
      if (this.payrollAccounts[el] instanceof Object) {
        this.payrollAccounts[el].error = null;
      }
    });
  }

  public reset() {
    this.parseMYOBSettings(this.MYOBSettings);
  }

}
