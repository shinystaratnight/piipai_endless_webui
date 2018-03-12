import {
  Component,
  ViewChild,
  HostListener,
  Input,
  OnInit,
  AfterViewInit
} from '@angular/core';

import { NavigationService, Page } from '../../services/navigation.service';
import { UserService, User } from '../../services/user.service';
import { CheckPermissionService } from '../../shared/services/check-permission';

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit, AfterViewInit {

  @ViewChild('header')
  public header: any;

  @ViewChild('list')
  public list: any;

  @ViewChild('item')
  public item: any;

  @ViewChild('nav')
  public nav: any;

  @ViewChild('userBlock')
  public userBlock: any;

  @Input()
  public pages: Page[];

  @Input()
  public user: User;

  public headerHeight: number;
  public error: any;
  public isCollapsed: boolean = false;
  public hideUserMenu: boolean = true;
  public greeting: string;
  public userPicture: string;
  public candidate: boolean;

  constructor(
    private navigationService: NavigationService,
    private userService: UserService
  ) { }

  public ngOnInit() {
    this.getUserInformation();
  }

  public ngAfterViewInit() {
    const header = this.header.nativeElement;
    this.headerHeight = header.offsetHeight - 1;

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1200) {
        this.isCollapsed = false;
      } else {
        this.headerHeight = header.offsetHeight - 1;
      }
    });
  }

  public getUserInformation() {
    if (this.user && this.user.data.contact) {
      this.greeting = `Welcome, ${this.user.data.contact.__str__}`;
      this.candidate = this.user.data.contact.contact_type === 'candidate';
    } else {
      this.greeting = `Welcome, Anonymous User`;
    }
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
    this.userService.logout();
  }

  @HostListener('document:click', ['$event'])
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
