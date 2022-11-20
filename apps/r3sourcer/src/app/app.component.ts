import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHelperService } from '@webui/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'webui-root',
  template: `
    <img
      *ngIf="loader"
      class="preloader"
      src="/assets/img/logo.svg"
      alt="R3sourcer"
      width="120"
      height="120"
    />
    <router-outlet
      (activate)="loader = false"
      (deactivate)="loader = true"
    ></router-outlet>
    <webui-toast></webui-toast>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  loader = true;
  langSubscription!: Subscription;

  constructor(
    private translate: TranslateService,
    private translateHelper: TranslateHelperService
  ) {}

  ngOnInit() {
    this.langSubscription = this.translateHelper.langChange$.subscribe((v) =>
      this.translate.use(v)
    );
  }

  ngOnDestroy() {
    this.langSubscription.unsubscribe();
  }
}
