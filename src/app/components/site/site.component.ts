import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SiteService, PageData } from '../../services/site.service';
import { GenericFormService } from '../../dynamic-form/services/generic-form.service';
import { NavigationService } from '../../services/navigation.service';
import { UserService, User } from '../../services/user.service';

import { CheckPermissionService } from '../../shared/services/check-permission';

@Component({
  selector: 'site',
  templateUrl: 'site.component.html'
})

export class SiteComponent implements OnInit {

  public pageData: PageData;
  public user: User;
  public dashboard: boolean = true;

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
  public permissionMethods: string[];
  public reload: boolean;

  public Jira: any;
  public jiraLoaded: boolean;

  public listName: string;

  public listNameCache = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private siteService: SiteService,
    private genericFormService: GenericFormService,
    private navigationService: NavigationService,
    private userService: UserService,
    private permission: CheckPermissionService
  ) {}

  public ngOnInit() {
    this.loadScript();
    this.formStorageEndpoint = '/ecore/api/v2/core/formstorages/';
    this.user = this.userService.user;
    this.updateJiraTask(this.user.currentRole);
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

  public loadScript() {
    this.Jira = document.createElement('script');
    this.Jira.src = 'https://taavisaavo.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/klpxh0/b/20/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=5a8ec06b'; //tslint:disable-line
    this.Jira.type = 'text/javascript';
    this.Jira.async = true;
    this.Jira.id = 'jira';
    this.Jira.charset = 'utf-8';
  }

  public checkPermission(type: string): boolean {
    return this.permissionMethods.indexOf(type) > -1;
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
        if (pageData.pathData.path === '/profile/') {
          this.pageData = pageData;
          this.permissionMethods = this.permission.getAllowMethods(undefined, pageData.endpoint);
        } else if (!pageData.endpoint) {
          this.router.navigate(['/']);
          return;
        } else {
          setTimeout(() => {
            this.pageData = pageData;
            this.permissionMethods = this.permission.getAllowMethods(undefined, pageData.endpoint);
            if (pageData.endpoint === '/ecore/api/v2/core/formstorages/') {
              this.formStorage = true;
            } else {
              this.formStorage = false;
            }
          }, 0);
        }
        this.setActivePage(this.pagesList, pageData.pathData.path);

        this.getNameOfList(pageData);
      }
    );
  }

  public getNameOfList(pageData: PageData) {
    if (pageData.pathData.type === 'form') {
      if (this.listNameCache[pageData.endpoint]) {
        this.listName = this.listNameCache[pageData.endpoint];
        return;
      }

      this.genericFormService.getMetadata(pageData.endpoint)
        .subscribe((list) => {
          if (list && list.list && list.list.label) {
            this.listName = list.list.label;
            this.listNameCache[pageData.endpoint] = list.list.label;
          }
        });
    }
  }

  public updateNavigationList(role: string) {
    this.updateJiraTask(role);

    this.userService.currentRole(role);
    this.navigationService.getPages(role)
      .subscribe((pages: any) => {
        this.permission.parseNavigation(this.permission.permissions, pages);
        this.pagesList = pages;

        if (this.router.url !== '/') {
          this.router.navigate(['']);
        }
      });
  }

  public updateJiraTask(role: string) {
    const trigger = document.getElementById('atlwdg-trigger');
    if (role === 'client' || role === 'candidate') {
      if (!trigger) {
        document.getElementsByTagName('head')[0].appendChild(this.Jira);
      } else {
        setTimeout(() => {
          let link = document.getElementById('atlwdg-trigger');
          if (link) {
            document.getElementById('atlwdg-trigger').style.display = 'block';
          }
        }, 1000);
      }
    } else {
      if (trigger) {
        trigger.style.display = 'none';
      }
    }
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
      (res: any) => this.modulesList = res
    );
  }

  public getUserModules(url) {
    this.navigationService.getUserModules().subscribe(
      (res: any) => this.userModules = res
    );
  }

  public getPages(url) {
    const role = this.user.currentRole;

    this.navigationService.getPages(role).subscribe(
      (res: any) => {
        this.pagesList = res;

        if (url.length) {
          this.getPageData(url);
        }
      }
    );
  }

  public changeMode(mode: string) {
    this.formMode = mode;
  }

  public formEvent(e) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
      return;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      if (this.pageData.pathData.postfix === 'submit') {
        this.router.navigate([this.pageData.pathData.path]);
        this.saveProcess = false;
        return;
      }
      if (!this.pageData.pathData.id) {
        this.router.navigate([this.pageData.pathData.path + e.data.id + '/change']);
        this.saveProcess = false;
        return;
      }
      this.saveProcess = false;
      this.formMode = 'view';
      this.reload = true;
      setTimeout(() => {
        this.reload = false;
      }, 150);
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

  public setActivePage(pages, path) {
    let active = false;
    pages.forEach((page) => {
      if (path === page.url && page.url !== '/') {
        active = true;
        page.active = true;
      } else if (page.childrens) {
        page.active = this.setActivePage(page.childrens, path);
        active = active || page.active;
      }
    });
    return active;
  }
}
