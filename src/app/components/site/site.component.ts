import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { SiteService, PageData } from '../../services/site.service';

@Component({
  selector: 'site',
  templateUrl: 'site.component.html'
})

export class SiteComponent implements OnInit {

  public pageData: PageData;
  public user: any;
  public dashboard: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private siteService: SiteService,
    private storage: LocalStorageService
  ) {}

  public ngOnInit() {
    this.user = this.storage.retrieve('contact');
    this.route.url.subscribe(
      (url: any) => {
        this.pageData = null;
        if (url.length) {
          this.dashboard = false;
          this.siteService.getDataOfPage(url).subscribe(
            (pageData: PageData) => {
              if (!pageData.endpoint) {
                this.router.navigate(['/']);
                return;
              }
              setTimeout(() => {
                this.pageData = pageData;
              }, 50);
            }
          );
        } else {
          this.dashboard = true;
        }
      }
    );
  }

  public formEvent(e) {
    if (e.type === 'sendForm' && e.status === 'success') {
      this.router.navigate([this.pageData.pathData.path]);
    }
  }

}
