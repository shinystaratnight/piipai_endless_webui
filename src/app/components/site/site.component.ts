import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { SiteService, PageData } from '../../services/site.service';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { NavigationService } from '../../services/navigation.service';
import { UserService } from '../../services/user.service';

import { CheckPermissionService } from '../../shared/services/check-permission';

@Component({
  selector: 'site',
  templateUrl: 'site.component.html'
})

export class SiteComponent implements OnInit {

  public pageData: PageData;
  public user: any;
  public dashboard: boolean = true;
  public pages: any;

  public modulesList: any;
  public userModules: any;
  public pagesList: any;
  public formLabel: string;

  public formStorage: boolean;
  public formStorageEndpoint: string;
  public approvedStorage: boolean;

  public error: any;

  public formMode: string;

  public saveProcess: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private siteService: SiteService,
    private storage: LocalStorageService,
    private genericFormService: GenericFormService,
    private navigationService: NavigationService,
    private userService: UserService,
    private permission: CheckPermissionService
  ) {}

  public ngOnInit() {
    this.formStorageEndpoint = '/ecore/api/v2/core/formstorages/';
    this.userService.getUserData().subscribe(
      (user: any) => {
        this.user = user.data;
      }
    );
    this.route.url.subscribe(
      (url: any) => {
        this.formLabel = '';
        this.pageData = null;
        this.getPageNavigation(url);
        if (url.length) {
          this.formMode = '';
          this.dashboard = false;
        } else {
          this.dashboard = true;
        }
      }
    );
  }

  public checkPermissions(pageData) {
    if (pageData.pathData.id) {
      this.permission.viewCheck(pageData.endpoint, pageData.pathData.id).subscribe(
        (res: any) => {
          this.pageData = pageData;
          if (pageData.endpoint === '/ecore/api/v2/core/formstorages/') {
            this.formStorage = true;
          } else {
            this.formStorage = false;
          }
        },
        (err: any) => window.history.back()
      );
    } else {
      this.permission.createCheck(pageData.endpoint).subscribe(
        (res: any) => {
          this.pageData = pageData;
          if (pageData.endpoint === '/ecore/api/v2/core/formstorages/') {
            this.formStorage = true;
          } else {
            this.formStorage = false;
          }
        },
        (err: any) => window.history.back()
      );
    }
  }

  public changeFormLabel(e) {
    if (e && e.str) {
      this.formLabel = e.str;
      if (e.data && this.formStorage) {
        this.approvedStorage = e.data.status;
      }
    }
  }

  public getPageData(url) {
    this.siteService.getDataOfPage(url, this.pagesList).subscribe(
      (pageData: PageData) => {
        if (!pageData.endpoint) {
          this.router.navigate(['/']);
          return;
        } else {
          this.checkPermissions(pageData);
        }
      }
    );
  }

  public getPageNavigation(url) {
    if (!this.modulesList) {
      this.getModelsList(url);
    }
    if (!this.pagesList) {
      this.getPages(url);
    }
    if (!this.userModules) {
      this.getUserModules(url);
    }
    if (this.modulesList && this.userModules && this.pagesList) {
      this.getPageData(url);
    }
  }

  public getModelsList(url) {
    this.navigationService.getModules().subscribe(
      (res: any) => {
        this.modulesList = res;
        if (this.pages && this.userModules && this.modulesList) {
          this.pagesList = this.filterNavigation(this.pages, this.userModules, this.modulesList);
          if (url.length) {
            this.getPageData(url);
          }
        }
      }
    );
  }

  public getUserModules(url) {
    this.navigationService.getUserModules().subscribe(
      (res: any) => {
        this.userModules = res;
        if (this.pages && this.userModules && this.modulesList) {
          this.pagesList = this.filterNavigation(this.pages, this.userModules, this.modulesList);
          if (url.length) {
            this.getPageData(url);
          }
        }
      }
    );
  }

  public getPages(url) {
    this.navigationService.getPages().subscribe(
      (res: any) => {
        this.pages = res;
        if (this.pages && this.userModules && this.modulesList) {
          this.pagesList = this.filterNavigation(this.pages, this.userModules, this.modulesList);
          if (url.length) {
            this.getPageData(url);
          }
        }
      }
    );
  }

  public changeMode(pageData) {
    this.permission.updateCheck(pageData.endpoint, pageData.pathData.id).subscribe(
      (res: any) => this.formMode = 'edit',
      (err: any) => this.error = err
    );
  }

  public formEvent(e) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      this.saveProcess = false;
      this.router.navigate([this.pageData.pathData.path]);
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public modeEvent(mode) {
    this.formMode = mode;
  }

  public deleteElement(element) {
    this.genericFormService.delete(element.endpoint, element.pathData.id).subscribe(
      (res: any) => this.router.navigate([element.pathData.path])
    );
  }

  public filterNavigation(pages, userModels, models) {
    let endpointsList = [];
    userModels.forEach((el) => {
      if (el && el.dashboard_module) {
        let model = models.filter((elem) => {
          if (elem.id === el.dashboard_module.id && !el.ui_config.display_on_navbar) {
            return true;
          } else {
            return false;
          }
        });
        if (model.length) {
          let appName = model[0].module_data.app.replace(/_/, '-');
          let modelName = model[0].module_data.plural_name.split(' ').join('').toLowerCase();
          let endpoint = `/ecore/api/v2/${appName}/${modelName}/`;
          endpointsList.push(endpoint);
        }
      }
    });
    this.removePages(pages, endpointsList);
    return pages;
  }

  public removePages(pages, endpoints) {
    pages.forEach((el, i) => {
      if (el.childrens && el.childrens.length) {
        if (endpoints.indexOf(el.endpoint) > -1) {
          el.disabled = true;
        }
        let childrens = this.removePages(el.childrens, endpoints);
        if (!childrens.length && el.disabled) {
          pages.splice(i, 1);
          this.removePages(pages, endpoints);
        }
      } else if (endpoints.indexOf(el.endpoint) > -1) {
        pages.splice(i, 1);
        this.removePages(pages, endpoints);
      }
    });
    return pages;
  }

  public updateNavigation(e) {
    if (e.changed) {
      this.pages = null;
      this.userModules = null;
      this.modulesList = null;
      this.getPageNavigation([]);
    }
  }

  public approveFormStorage(element) {
    let endpoint = `${this.formStorageEndpoint}${element.pathData.id}/approve/`;
    let body = {
      status: 'True'
    };
    this.genericFormService.submitForm(endpoint, body).subscribe(
      (res: any) => this.router.navigate([element.pathData.path]),
      (err: any) => this.error = err
    );
  }
}
