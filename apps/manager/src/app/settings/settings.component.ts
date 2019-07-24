import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { SettingsService } from './settings.service';
import { UserService } from '@webui/core';
import { Page, Role, User } from '@webui/data';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html'
})

export class SettingsComponent implements OnInit, OnDestroy {

  public user: User;
  public pagesList: Page[];

  public url: any;

  private settingsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private userService: UserService,
  ) {}

  public ngOnInit() {
    const currentURL = { path: 'settings' };
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];
    this.settingsSubscription = this.settingsService.url.subscribe((child) => {
      this.url = [].concat(currentURL, child);

      this.setActivePage(this.pagesList, `/${this.url.map((el) => el.path).join('/')}/`);
    });
  }

  public ngOnDestroy() {
    this.setActivePage(this.pagesList, '');

    this.settingsSubscription.unsubscribe();
  }

  public updateNavigation(role: Role) {
    this.userService.currentRole(role);
    setTimeout(() => {
      this.router.navigate(['']);
    }, 150);
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
