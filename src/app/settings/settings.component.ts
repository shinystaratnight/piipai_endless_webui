import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
  ) {}

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'].data;
    this.pagesList = this.route.snapshot.data['pagesList'];
    this.url = this.router.url.slice(1).split('/').map((el) => { return {path: el}; });
  }

}
