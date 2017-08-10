import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SiteService, PageData } from '../../services/site.service';

@Component({
  selector: 'site',
  templateUrl: 'site.component.html'
})

export class SiteComponent implements OnInit {

  public pageData: PageData;

  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService
  ) {}

  public ngOnInit() {
    this.route.url.subscribe(
      (url: any) => {
        this.pageData = null;
        if (url.length) {
          this.siteService.getDataOfPage(url).subscribe(
            (pageData: PageData) => {
              this.pageData = pageData;
            }
          );
        }
      }
    );
  }

}
