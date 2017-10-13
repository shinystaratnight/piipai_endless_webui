import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { SiteService, PageData } from '../../services/site.service';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { NavigationService } from '../../services/navigation.service';
import { UserService } from '../../services/user.service';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private siteService: SiteService,
    private storage: LocalStorageService,
    private genericFormService: GenericFormService,
    private navigationService: NavigationService,
    private userService: UserService
  ) {}

  public ngOnInit() {
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
          this.dashboard = false;
        } else {
          this.dashboard = true;
        }
      }
    );
  }

  public changeFormLabel(e) {
    if (e && e.str) {
      this.formLabel = e.str;
    }
  }

  public getPageData(url) {
    this.siteService.getDataOfPage(url, this.pagesList).subscribe(
      (pageData: PageData) => {
        if (!pageData.endpoint) {
          this.router.navigate(['/']);
          return;
        }
        setTimeout(() => {
          this.pageData = pageData;
        }, 50);
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

  public formEvent(e) {
    if (e.type === 'sendForm' && e.status === 'success') {
      this.router.navigate([this.pageData.pathData.path]);
    }
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
}
