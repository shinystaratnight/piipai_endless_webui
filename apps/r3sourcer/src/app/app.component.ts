import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHelperService } from '@webui/core';
import { DialogService } from '@webui/dialog';
import { Subject, takeUntil } from 'rxjs';

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
  private _destroy = new Subject<void>();

  loader = true;

  constructor(
    private translate: TranslateService,
    private translateHelper: TranslateHelperService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.translateHelper.langChange$
      .pipe(takeUntil(this._destroy))
      .subscribe((v) => this.translate.use(v));

    this.dialogService.init();
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    this.dialogService.destroy();
  }
}
