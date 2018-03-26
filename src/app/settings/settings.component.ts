import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from './settings.service';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.component.html'
})

export class SettingsComponent implements OnInit {

  public user: any;
  public pagesList: any;

  public url: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  public ngOnInit() {
    let currentURL = { path: 'settings' };
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];
    this.settingsService.url.subscribe((child) => {
      this.url = [].concat(currentURL, child);
    });
  }

}
