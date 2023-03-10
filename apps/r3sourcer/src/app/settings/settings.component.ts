import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { SettingsService } from './settings.service';
import { EventService, EventType } from '@webui/core';
import { Page } from '@webui/data';
import { User } from '@webui/models';

@Component({
  selector: 'webui-settings-page',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  public user!: User;
  public pagesList!: Page[];

  public url: any;

  private settingsSubscription!: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    // private userService: UserService,
    private eventService: EventService
  ) {}

  public ngOnInit() {
    const currentURL = { path: 'settings' };
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];
    this.settingsSubscription = this.settingsService.url.subscribe(child => {
      this.url = Array.from([currentURL, child]);

      this.setActivePage(
        this.pagesList,
        `/${this.url.map((el: any) => el.path).join('/')}/`
      );
    });

    // this.subscriptions.push(
    //   this.eventService.event$.subscribe((type: EventType) => {
    //     if (type === EventType.RoleChanged) {
    //       setTimeout(() => {
    //         this.router.navigate(['']);
    //       }, 150);
    //     }
    //   })
    // );
  }

  public ngOnDestroy() {
    this.setActivePage(this.pagesList, '');

    this.settingsSubscription.unsubscribe();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // public updateNavigation(role: Role) {
  //   // this.userService.currentRole(role);
  //   setTimeout(() => {
  //     this.router.navigate(['']);
  //   }, 150);
  // }

  public setActivePage(pages: any[], path: string) {
    let active = false;
    pages.forEach(page => {
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
}
