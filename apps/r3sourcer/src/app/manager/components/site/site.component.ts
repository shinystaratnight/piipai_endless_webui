import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Subject, Subscription } from 'rxjs';

import {
  SiteService,
  UserService,
  AuthService,
  NavigationService,
  SiteSettingsService,
  CompanyPurposeService,
  EventService,
  EventType,
} from '@webui/core';
import { PageData } from '@webui/data';
import { GenericFormService, FormMode } from '@webui/dynamic-form';
import { CheckPermissionService, ToastService, MessageType } from '@webui/core';
import { isMobile, isCandidate, isClient, isManager } from '@webui/utilities';
import { finalize } from 'rxjs/operators';
import { DialogService, DialogRef } from '@webui/dialog';
import { DialogType, Endpoints, Role, User } from '@webui/models';
import { empty } from 'ramda';

@Component({
  selector: 'webui-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit, OnDestroy {
  public pageData?: PageData | null;
  public user?: User | null;
  public dashboard = true;
  public currentRole?: Role;
  public changePasswordEndpoint!: string;

  public modulesList: any;
  public userModules: any;
  public pagesList: any;
  public formLabel!: string;
  public fillInData = {
    responseField: 'list',
    paginated: 'off',
    supportData: 'job',
    metaType: true,
    actions: true,
  };
  public FormMode = FormMode;

  public formStorage!: boolean;
  public formStorageEndpoint = '/core/formstorages/';
  public approvedStorage!: boolean;

  public error: any;

  public formMode!: FormMode | null;

  public saveProcess!: boolean;
  public permissionMethods!: string[];
  public reload!: boolean;

  public Jira: any;
  public jiraLoaded!: boolean;

  public upload: Subject<boolean> = new Subject();
  public listName!: string;

  public listNameCache: Record<string, any> = {};
  public errors: any = {};

  public acceptenceTestData: any;
  public additionalData: any;
  public data: any;
  public endpointWithoutViewMode: string[] = ['/core/users/'];
  public passwordData: any;

  public modalRef!: NgbModalRef;

  public mobileDesign: string[] = [
    '/hr/timesheets/approved/',
    '/hr/timesheets/history/',
    '/hr/timesheets/unapproved/',
  ];

  public fillInDataSending = false;

  public loader!: boolean;

  private subscriptions: Subscription[] = [];

  public rowId: any = '';
  public dialogRef!: DialogRef;

  get isMobileDevice() {
    return isMobile() && isCandidate();
  }

  get isClient() {
    return isClient();
  }

  get isManager() {
    return isManager();
  }

  get backToListLabel() {
    return `Back to ${this.listName.toLocaleLowerCase()} list`;
  }

  @ViewChild('modal') public modal!: ElementRef;
  @ViewChild('forgotPassword') public forgotPasswordModal!: ElementRef;

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
    private purposeService: CompanyPurposeService,
    private eventService: EventService,
    private dialogService: DialogService
  ) {}

  public ngOnInit() {
    this.loadScript();
    this.user = this.userService.user;
    this.currentRole = this.user?.currentRole;
    this.changePasswordEndpoint = `${Endpoints.Contact}${this.user?.data.contact.id}/change_password/`;
    this.updateJiraTask(this.user?.currentRole);

    this.route.url.subscribe((url: any) => {
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
    });

    // this.subscriptions.push(
    //   this.eventService.event$.subscribe((type: EventType) => {
    //     if (type === EventType.RoleChanged) {
    //       this.updateNavigationList();
    //     }
    //   })
    // );
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }

    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public loadScript() {
    this.Jira = document.createElement('script');
    this.Jira.src =
      'https://taavisaavo.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/klpxh0/b/20/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=5a8ec06b'; //tslint:disable-line
    this.Jira.type = 'text/javascript';
    this.Jira.async = true;
    this.Jira.id = 'jira';
    this.Jira.charset = 'utf-8';
  }

  public checkPermission(type: string): boolean {
    if (isManager()) {
      return this.permissionMethods.indexOf(type) > -1;
    } else {
      return true;
    }
  }

  public changeFormLabel(e: any) {
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

  public getPageData(url: Array<{ path: string }>) {
    this.siteService
      .getDataOfPage(url, this.pagesList)
      .subscribe((pageData: PageData) => {
        if (pageData.endpoint === '/core/workflownodes/') {
          this.additionalData = {
            company: {
              action: 'add',
              data: {
                value: {
                  id: this.siteSettingsService.settings.company,
                },
              },
            },
          };
          this.pageData = pageData;
          this.permissionMethods = this.permission.getAllowMethods(
            undefined,
            pageData.endpoint
          );
        } else if (this.isProfilePage(pageData)) {
          if (this.user) {
            pageData.pathData.id = this.user.data.contact.candidate_contact;
            pageData.endpoint = '/candidate/candidatecontacts/';
            this.formMode = FormMode.View;
            this.pageData = pageData;
            this.permissionMethods = this.permission.getAllowMethods(
              undefined,
              pageData.endpoint
            );
          }
        } else if (
          pageData.endpoint === '/' &&
          pageData.pathData.path !== '/'
        ) {
          setTimeout(() => {
            this.ts.sendMessage('Page not found!', MessageType.Error);
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
            if (isClient()) {
              this.permissionMethods = ['delete', 'get', 'post', 'update'];
            } else {
              this.permissionMethods = this.permission.getAllowMethods(
                undefined,
                pageData.endpoint
              );
            }
            if (pageData.endpoint === '/core/formstorages/') {
              this.formStorage = true;
            } else {
              this.formStorage = false;
            }
          }, 0);
        }
        this.setActivePage(this.pagesList, pageData.pathData.path);

        this.getNameOfList(pageData);
      });
  }

  public getNameOfList(pageData: PageData) {
    if (pageData.pathData.type === 'form') {
      if (this.listNameCache[pageData.endpoint]) {
        this.listName = this.listNameCache[pageData.endpoint];
        return;
      }

      this.genericFormService
        .getMetadata(pageData.endpoint)
        ?.subscribe((list) => {
          if (list && list.list && list.list.label) {
            this.listName = list.list.label;
            this.listNameCache[pageData.endpoint] = list.list.label;
          }
        });
    }
  }

  public updateNavigationList() {
    // this.pageData = null;
    // this.updateJiraTask(role);
    // this.dashboard = false;

    // this.userService.currentRole(role);
    this.loader = true;
    window.location.href = '';

    // if (isManager()) {
    //   window.location.href = '';
    //   this.router.navigate(['']);
    // }

    // if (isClient()) {
    //   this.router.navigate(['/cl']);
    // }

    // if (isCandidate()) {
    //   this.router.navigate(['/cd']);
    // }

    // this.currentRole = role;
    // this.navigationService.getPages(role)
    //   .subscribe((pages: any) => {
    //     if (!role.__str__.includes('candidate') && !role.__str__.includes('client')) {
    //       this.permission.parseNavigation(this.permission.permissions, pages);
    //     }
    //     this.pagesList = pages;

    //     if (this.router.url !== '/') {
    //       this.router.navigate(['']);
    //     } else {
    //       setTimeout(() => {
    //         this.dashboard = true;
    //       }, 100);
    //     }
    //   });
  }

  public updateJiraTask(role?: Role) {
    if (!role) {
      return;
    }

    const trigger = document.getElementById('atlwdg-trigger');
    if (role.__str__.includes('client') || role.__str__.includes('candidate')) {
      if (!trigger) {
        document.getElementsByTagName('head')[0].appendChild(this.Jira);
      } else {
        setTimeout(() => {
          const link = document.getElementById('atlwdg-trigger');
          if (link) {
            const el = document.getElementById('atlwdg-trigger');

            if (el) {
              el.style.display = 'block';
            }
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
    if (!this.pagesList) {
      this.getPages(url);
    }
    if (this.pagesList) {
      this.getPageData(url);
    }
  }

  public getPages(url: Array<{ path: string }>) {
    const role = this.user?.currentRole;
    // const companyId = isManager() ? this.user.data.contact.company_id : '';

    this.navigationService.getPages(role).subscribe((res: any) => {
      this.pagesList = res;

      if (url.length) {
        this.getPageData(url);
      }
    });
  }

  public changeMode(mode: FormMode) {
    this.formMode = mode;
  }

  public formEvent(e: any) {
    const rowId = this.pageData?.pathData.id as string;
    localStorage.setItem('rowId', rowId);
    if (e.type === 'saveStart') {
      this.saveProcess = true;
      return;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      if (this.pageData?.pathData.postfix === 'submit') {
        this.router.navigate([
          '/' + this.authService.getRedirectUrl() + this.pageData.pathData.path,
        ]);
        this.saveProcess = false;
        return;
      }
      if (!this.pageData?.pathData.id) {
        this.router.navigate([
          '/' +
            this.authService.getRedirectUrl() +
            this.pageData?.pathData.path +
            e.data.id +
            '/change',
        ]);
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

  public deleteElement(element: any) {
    this.eventService.emit(EventType.OpenDialog, {
      type: DialogType.ConfirmAction,
      onInit: (dialogRef: any) => (this.dialogRef = dialogRef),
      content: {
        message: 'message.confirm_delete_instance',
        model: this.listName.toLowerCase(),
        name: this.formLabel,
        accept: 'delete',
        decline: 'action.do_not_delete',
      },
    });

    this.dialogRef.result
      .then(() => {
        this.genericFormService
          .delete(element.endpoint, element.pathData.id)
          .subscribe({
            next: () => {
              const path = `/${this.authService.getRedirectUrl()}${
                element.pathData.path
              }`;

              this.router.navigate([path]);
            },
            error: (err: any) => {
              this.errors = err.errors;
            },
          });
      })
      .catch(() => empty({}));
  }

  public updateNavigation(e: any) {
    if (e.changed) {
      this.userModules = null;
      this.modulesList = null;
      this.getPageNavigation([]);
    }
  }

  public approveFormStorage(element: any) {
    const endpoint = `${this.formStorageEndpoint}${element.pathData.id}/approve/`;
    const body = {
      status: 'True',
    };
    this.genericFormService.submitForm(endpoint, body).subscribe(
      () =>
        this.router.navigate([
          '/' + this.authService.getRedirectUrl() + element.pathData.path,
        ]),
      (err: any) => (this.error = err)
    );
  }

  public setActivePage(pages: any[], path: string) {
    let active = false;
    pages.forEach((page) => {
      if (path === page.url && page.url !== '/') {
        active = true;
        page.active = true;
      } else if (page.children) {
        page.active = this.setActivePage(page.children, path);
        active = active || page.active;
      }
    });
    return active;
  }

  public getClientId(): string | undefined {
    if (this.currentRole?.__str__.includes('client')) {
      return this.currentRole.id;
    }

    return undefined;
  }

  public setTestData(data: any) {
    this.acceptenceTestData = data.data;
  }

  public openChangePassword() {
    this.modalRef = this.modalService.open(this.modal, { backdrop: 'static' });
  }

  public openResetForm() {
    this.modalRef?.close();
    this.passwordData = {
      email: {
        action: 'add',
        data: {
          value: this.user?.data.contact.email,
          read_only: true,
        },
      },
    };

    this.modalRef = this.modalService.open(this.forgotPasswordModal, {
      backdrop: 'static',
    });

    return false;
  }

  public resetEvent(response: any) {
    if (response && response.status === 'success') {
      this.authService.logout();
    }
  }

  public checkedObjects(data: { checkedData: string[]; filters: any }) {
    const { checkedData: candidates, filters } = data;
    const shifts = filters.keys.date.value
      .filter(({ checked }: { checked: boolean }) => checked)
      .map(({ data: { id } }: { data: { id: string } }) => id);

    if (!candidates.length || !shifts.length) {
      this.data = null;

      return;
    }

    this.data = {
      candidates,
      shifts,
    };
  }

  public back() {
    const redirectUrl = this.authService.getRedirectUrl();
    const path = this.pageData?.pathData.path;
    const id = this.getId(this.pageData?.endpoint);
    const url = `/${redirectUrl}${path}/${id}/change`;

    this.router.navigate([url]);
  }

  public sendData() {
    if (this.data && !this.fillInDataSending) {
      this.fillInDataSending = true;

      this.genericFormService
        .submitForm(this.pageData?.endpoint as string, this.data)
        .pipe(finalize(() => (this.fillInDataSending = false)))
        .subscribe(
          () => this.back(),
          (err: any) => {
            const { detail } = err.errors;

            if (!detail) {
              return;
            }

            this.ts.sendMessage(detail, MessageType.Error);
          }
        );
    }
  }

  public getId(path?: string): string {
    if (!path) {
      return '';
    }

    const keys = path.split('/');

    return keys[keys.length - 3];
  }

  public identifyDevice() {
    if (this.pageData) {
      if (
        this.user?.currentRole.__str__.includes('client') &&
        this.pageData.pathData.path === '/'
      ) {
        return isMobile();
      }
    }
    return false;
  }

  public permissionErrorHandler() {
    const path =
      (this.pageData &&
        this.pageData.pathData &&
        this.pageData.pathData.path) ||
      '';
    this.router.navigate(['/' + this.authService.getRedirectUrl() + path]);
  }

  public showDeleteButton() {
    return (
      this.pageData?.pathData.id &&
      this.checkPermission('delete') &&
      !this.isProfilePage(this.pageData)
    );
  }

  public isProfilePage(page: PageData) {
    return page.pathData.path === '/profile/';
  }
}
