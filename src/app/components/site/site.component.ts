import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';

import {
  SiteService,
  PageData,
  UserService,
  AuthService,
  User,
  Role,
  NavigationService,
  SiteSettingsService
} from '../../services/';
import { GenericFormService, FormMode } from '../../dynamic-form/services/';
import { CheckPermissionService, ToastService, MessageType } from '../../shared/services/';
import { isMobile, isCandidate } from '../../helpers/utils';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})

export class SiteComponent implements OnInit, OnDestroy {

  public pageData: PageData;
  public user: User;
  public dashboard = true;
  public currentRole: Role;
  public changePasswordEndpoint: string;

  public modulesList: any;
  public userModules: any;
  public pagesList: any;
  public formLabel: string;
  public fillInData = {
    responseField: 'list',
    paginated: 'off',
    supportData: 'job',
    metaType: true,
    actions: true,
  };
  public FormMode = FormMode;

  public formStorage: boolean;
  public formStorageEndpoint = '/core/formstorages/';
  public approvedStorage: boolean;

  public error: any;

  public formMode: FormMode;

  public saveProcess: boolean;
  public permissionMethods: string[];
  public reload: boolean;

  public Jira: any;
  public jiraLoaded: boolean;

  public upload: Subject<boolean> = new Subject();
  public listName: string;

  public listNameCache = {};
  public errors: any = {};

  public acceptenceTestData: any;
  public additionalData: any;
  public data: any;
  public endpointWithoutViewMode: string[] = [
    '/core/users/'
  ];
  public passwordData: any;

  public modalRef: NgbModalRef;

  public mobileDesign = [
    '/hr/timesheets/approved/',
    '/hr/timesheets/history/',
    '/hr/timesheets/unapproved/',
  ];

  get isMobileDevice() {
    return isMobile() && isCandidate();
  }

  @ViewChild('modal') public modal;
  @ViewChild('forgotPassword') public forgotPasswordModal;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private siteService: SiteService,
    private genericFormService: GenericFormService,
    private navigationService: NavigationService,
    private userService: UserService,
    private authService: AuthService,
    private permission: CheckPermissionService,
    private ts: ToastService,
    private siteSettingsService: SiteSettingsService,
    private modalService: NgbModal,
  ) {}

  public ngOnInit() {
    this.loadScript();
    this.user = this.userService.user;
    this.currentRole = this.user.currentRole;
    this.changePasswordEndpoint = `/core/contacts/${this.user.data.contact.id}/change_password/`;
    this.updateJiraTask(this.user.currentRole);

    this.route.url.subscribe(
      (url: any) => {
        this.formLabel = '';
        this.pageData = null;
        setTimeout(() => {
          this.getPageNavigation(url);
        }, 0);
        if (url.length) {
          this.formMode = null;
          this.dashboard = false;
        } else {
          this.dashboard = true;
        }
      }
    );
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
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

  public onModalScrollDown() {
    this.upload.next(true);
  }

  public getPageData(url) {
    this.siteService.getDataOfPage(url, this.pagesList).subscribe(
      (pageData: PageData) => {
        if (pageData.endpoint === '/core/workflownodes/') {
          this.additionalData = {
            company: {
              action: 'add',
              data: {
                value: {
                  id: this.siteSettingsService.settings.company_settings.company
                }
              }
            }
          };
          this.pageData = pageData;
          this.permissionMethods = this.permission.getAllowMethods(undefined, pageData.endpoint);
        } else if (this.isProfilePage(pageData)) {
          pageData.pathData.id = this.user.data.contact.candidate_contact;
          pageData.endpoint = '/candidate/candidatecontacts/';
          this.formMode = FormMode.View;
          this.pageData = pageData;
          this.permissionMethods = this.permission.getAllowMethods(undefined, pageData.endpoint);
        } else if (pageData.endpoint === '/' && pageData.pathData.path !== '/') {
          setTimeout(() => {
            this.ts.sendMessage('Page not found!', MessageType.error);
          }, 2000);

          this.router.navigate(['']);
          return;
        } else {
          setTimeout(() => {
            this.pageData = pageData;
            if (
              pageData.pathData.id &&
              this.endpointWithoutViewMode.indexOf(pageData.endpoint) === -1
            ) {
              this.formMode = FormMode.View;
            }
            this.permissionMethods = this.permission.getAllowMethods(undefined, pageData.endpoint);
            if (pageData.endpoint === '/core/formstorages/') {
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

  public updateNavigationList(role: Role) {
    this.updateJiraTask(role);

    this.userService.currentRole(role);
    this.currentRole = role;
    this.navigationService.getPages(role)
      .subscribe((pages: any) => {
        if (!role.__str__.includes('candidate') && !role.__str__.includes('client')) {
          this.permission.parseNavigation(this.permission.permissions, pages);
        }
        this.pagesList = pages;

        if (this.router.url !== '/') {
          this.router.navigate(['']);
        }
      });
  }

  public updateJiraTask(role: Role) {
    const trigger = document.getElementById('atlwdg-trigger');
    if (role.__str__.includes('client') || role.__str__.includes('candidate')) {
      if (!trigger) {
        document.getElementsByTagName('head')[0].appendChild(this.Jira);
      } else {
        setTimeout(() => {
          const link = document.getElementById('atlwdg-trigger');
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

  public getPageNavigation(url: any[]) {
    if (!this.modulesList && !url.length) {
      this.getModelsList(url);
    }
    if (!this.pagesList) {
      this.getPages(url);
    }
    if (!this.userModules && !url.length) {
      this.getUserModules(url);
    }
    if (this.pagesList) {
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

  public changeMode(mode: FormMode) {
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
      this.formMode = FormMode.View;
      this.reload = true;
      setTimeout(() => {
        this.reload = false;
      }, 150);
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public modeEvent(mode: FormMode) {
    this.formMode = mode;
  }

  public deleteElement(element) {
    this.genericFormService.delete(element.endpoint, element.pathData.id).subscribe(
      (res: any) => this.router.navigate([element.pathData.path]),
      (err: any) => this.errors = err.errors
    );
  }

  public updateNavigation(e) {
    if (e.changed) {
      this.userModules = null;
      this.modulesList = null;
      this.getPageNavigation([]);
    }
  }

  public approveFormStorage(element) {
    const endpoint = `${this.formStorageEndpoint}${element.pathData.id}/approve/`;
    const body = {
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

  public getClientId(): string | undefined {
    if (this.currentRole.__str__.includes('client')) {
      return this.currentRole.id;
    }

    return undefined;
  }

  public setTestData(data) {
    this.acceptenceTestData = data.data;
  }

  public openChangePassword() {
    this.modalRef = this.modalService.open(this.modal);
  }

  public openResetForm() {
    this.modalRef.close();
    this.passwordData = {
      email: {
        action: 'add',
        data: {
          value: this.user.data.contact.email,
          read_only: true
        }
      }
    };

    this.modalRef = this.modalService.open(this.forgotPasswordModal);

    return false;
  }

  public resetEvent(response) {
    if (response && response.status === 'success') {
      this.authService.logout();
    }
  }

  public checkedObjects(e) {
    const shifts = e.filters.keys.date.value.filter((el) => el.checked);
    this.data = {
      candidates: e.checkedData,
      shifts: shifts.map((el) => el.data.id)
    };
  }

  public back() {
    this.router.navigate([this.pageData.pathData.path + '/' + this.getId(this.pageData.endpoint) + '/change']); //tslint:disable-line

    return false;
  }

  public sendData() {
    if (this.data) {
      this.genericFormService.submitForm(this.pageData.endpoint, this.data).subscribe(
        (res: any) => this.router.navigate([this.pageData.pathData.path + '/' + this.getId(this.pageData.endpoint) + '/change']), //tslint:disable-line
        (err: any) => this.error = err
      );
    }
  }

  public getId(path: string): string {
    const keys = path.split('/');

    return keys[keys.length - 3];
  }

  public identifyDevice() {
    if (this.pageData) {
      if (this.user.currentRole.__str__.includes('client') && this.pageData.pathData.path === '/' ) {
        return isMobile();
      }
    }
  }

  public permissionErrorHandler() {
    const path = this.pageData && this.pageData.pathData && this.pageData.pathData.path || '/';
    this.router.navigate([path]);
  }

  public showDeleteButton() {
    return this.pageData.pathData.id
      && this.checkPermission('delete')
      && !this.isProfilePage(this.pageData);
  }

  public isProfilePage(page: PageData) {
    return page.pathData.path === '/profile/';
  }
}
