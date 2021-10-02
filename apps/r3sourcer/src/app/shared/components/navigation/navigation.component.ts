import {
  Component,
  ViewChild,
  HostListener,
  Input,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Output,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  AuthService,
  NavigationService,
  TranslateHelperService,
  UserService,
  DateService,
} from '@webui/core';
import { User, Page, Role, Language } from '@webui/data';
import {
  getContactAvatar,
  isClient,
  isCandidate,
  isManager,
  getTimeInstance
} from '@webui/utilities';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('header') public header: any;
  @ViewChild('list') public list: any;
  @ViewChild('item') public item: any;
  @ViewChild('nav') public nav: any;
  @ViewChild('userBlock') public userBlock: any;
  @ViewChild('modal') public modal: any;
  @ViewChild('roles') public rolesTemplate: any;

  @Input() public user: User;
  @Input() public logo = '/assets/img/new-software.svg';

  // @Output() public update: EventEmitter<Role> = new EventEmitter();
  @Output()
  public changePasswordEmitter: EventEmitter<any> = new EventEmitter();

  public headerHeight: number;
  public error: any;
  public isCollapsed = false;
  public hideUserMenu = true;
  public greeting: string;
  public userPicture: string;
  public candidate: boolean;
  public currentRole: string;
  public company: string;
  public picture: string;
  public contactAvatar: string;
  public urlPrefix = isClient()
    ? '/cl'
    : isCandidate()
    ? '/cd'
    : isManager
    ? '/mn'
    : '';
  public initTime: boolean;
  isManager = isManager;

  language = new FormControl(Language.English);
  Language = Language;

  private modalRef: NgbModalRef;

  get pages(): Page[] {
    const menu = this.navigationService.navigationList[this.currentRole];

    return menu;
  }

  get fullName(): string {
    return this.user.currentRole.__str__.split(':').map(el => el.trim()).slice(0, 2).join(' - ');
  }

  get trialMessage() {
    const date = this.dateService.instance;
    const expires = date(this.user.data.end_trial_date, 'YYYY-MM-DD hh:mm:ss');

    if (expires.isAfter(date())) {
      return `Trail version expires ${expires.format()}`;
    } else {
      return null;
    }
  }

  get roleList() {
    return this.user.data.roles.filter((el) => el.id !== this.user.currentRole.id)
  }

  public resizeSubscription: Subscription;
  public languageSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService,
    private userService: UserService,
    private translate: TranslateHelperService,
    private dateService: DateService,
    private modalService: NgbModal
  ) {}

  public ngOnInit() {
    this.getUserInformation();

    this.languageSubscription = this.language.valueChanges.subscribe((v) => {
      this.translate.setLang(v);
    });
  }

  public ngAfterViewInit() {
    const header = this.header.nativeElement;

    setTimeout(() => {
      this.headerHeight = header.offsetHeight - 1;
    }, 200);

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        if (window.innerWidth > 1200 && this.isCollapsed === true) {
          this.isCollapsed = false;
        } else if (this.headerHeight !== header.offsetHeight - 1) {
          this.headerHeight = header.offsetHeight - 1;
        }
      });
  }

  public ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }

    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  public getUserInformation() {
    if (this.user && this.user.data.contact) {
      this.currentRole = this.user.currentRole.id;
      this.greeting = `Welcome, ${this.user.data.contact.__str__}`;
      this.checkCandidateRole(this.user.currentRole);
      this.company = this.user.data.contact.company;
      this.picture =
        this.user.data.contact.picture && this.user.data.contact.picture.origin;

      if (!this.picture) {
        this.contactAvatar = getContactAvatar(this.user.data.contact.__str__);
      }
    } else {
      this.greeting = `Welcome, Anonymous User`;
    }
  }

  public formatDate(date) {
    return getTimeInstance()(date, 'YYYY-MM-DD hh:mm:ss').format('YYYY/MM/DD');
  }

  public checkCandidateRole(role) {
    this.candidate = role.__str__.includes('candidate');
  }

  public hideUserBlock(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isCollapsed = false;
    this.hideUserMenu = !this.hideUserMenu;
  }

  public showNavigation(e) {
    e.preventDefault();
    e.stopPropagation();
    this.hideUserMenu = true;
    this.isCollapsed = !this.isCollapsed;
  }

  public logOut() {
    this.authService.logout();
  }

  public changeRole(id: string) {
    const role = this.user.data.roles.find((el: Role) => el.id === id);

    this.checkCandidateRole(role);

    this.currentRole = role.id;

    // this.update.emit(role);
    this.userService.currentRole(role);
  }

  public clickAction(e, p) {
    e.stopPropagation();
    e.preventDefault();

    p.opened = !p.opened;

    if (p.url !== '/') {
      this.isCollapsed = false;
    }

    return false;
  }

  public checkUrlPrefix(url) {
    if (url.includes('settings') || url.includes('billing')) {
      return false;
    }

    return true;
  }

  public changePassword() {
    this.hideUserMenu = true;
    this.changePasswordEmitter.emit();

    return false;
  }

  public getDisableTitle(menu: string): string {
    return `You do not have permission to access ${menu}. Please contact your administrator.`;
  }

  public chooseRole(event) {
    event.preventDefault();
    event.stopPropagation();

    this.modalRef = this.modalService.open(this.rolesTemplate);
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (
        (this.nav && clickedComponent === this.nav.nativeElement) ||
        (this.userBlock && clickedComponent === this.userBlock.nativeElement)
      ) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      if (this.isCollapsed) {
        this.isCollapsed = false;
      }
      if (!this.hideUserMenu) {
        this.hideUserMenu = true;
      }
    }
  }
}
