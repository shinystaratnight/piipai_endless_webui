import {
  Component,
  ViewChild,
  AfterContentChecked,
  HostListener,
  Input,
  OnInit
} from '@angular/core';

import { LocalStorageService } from 'ng2-webstorage';
import { NavigationService } from '../../services/navigation.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit, AfterContentChecked {

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
  public pages: any[] = [];

  public headerHeight: number;
  public error: any;
  public isCollapsed: boolean = false;
  public hideUserMenu: boolean = true;
  public greeting: string;
  public userPicture: string;
  public user: any;

  constructor(
    private storage: LocalStorageService,
    private navigationService: NavigationService,
    private userService: UserService
  ) { }

  public ngOnInit() {
    this.getUserInformation();
  }

  public ngAfterContentChecked() {
    this.headerHeight = this.header.nativeElement.clientHeight;
  }

  public getUserInformation() {
    let contact = this.storage.retrieve('contact');
    if (contact) {
      this.userService.getUserData(contact.id).subscribe(
        (res: any) => {
          this.user = res;
          this.greeting = `Welcome, ${this.user.__str__}`;
          this.userPicture = (res.picture) ? res.picture.thumb : '/assets/img/avatar.png';
        }
      );
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
