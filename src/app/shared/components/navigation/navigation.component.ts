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
  OnDestroy,
} from '@angular/core';

import { User, AuthService, Page, Role } from '../../../services';
import { getContactAvatar } from '../../../helpers/utils';

import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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

  @Input() public pages: Page[];
  @Input() public user: User;
  @Input() public logo: string;

  @Output() public update: EventEmitter<Role> = new EventEmitter();
  @Output() public changePasswordEmitter: EventEmitter<any> = new EventEmitter();

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

  public resizeSubscription: Subscription;

  constructor(
    private authService: AuthService,
  ) { }

  public ngOnInit() {
    this.getUserInformation();
  }

  public ngAfterViewInit() {
    const header = this.header.nativeElement;
    this.headerHeight = header.offsetHeight - 1;

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(
        debounceTime(200)
      )
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
  }

  public getUserInformation() {
    if (this.user && this.user.data.contact) {
      this.currentRole = this.user.currentRole.id;
      this.greeting = `Welcome, ${this.user.data.contact.__str__}`;
      this.checkCandidateRole(this.user.currentRole);
      this.company = this.user.data.contact.company;
      this.picture = this.user.data.contact.picture && this.user.data.contact.picture.origin;

      if (!this.picture) {
        this.contactAvatar = getContactAvatar(this.user.data.contact.__str__);
      }
    } else {
      this.greeting = `Welcome, Anonymous User`;
    }
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
    const role  = this.user.roles.find((el: Role) => el.id === id);

    this.checkCandidateRole(role);

    this.currentRole = role.id;

    this.update.emit(role);
  }

  public clickActione(e, p) {
    e.stopPropagation();
    e.preventDefault();

    p.opened = !p.opened;

    if (p.url !== '/') {
      this.isCollapsed = false;
    }

    return false;
  }

  public changePassword() {
    this.hideUserMenu = true;
    this.changePasswordEmitter.emit();

    return false;
  }

  public getDisableTitle(menu: string): string {
    return `You do not have permission to access ${menu}. Please contact your administrator.`;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if ((this.nav && clickedComponent === this.nav.nativeElement) ||
        (this.userBlock && clickedComponent === this.userBlock.nativeElement)) {
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
