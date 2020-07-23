import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: `
    <img *ngIf="loader" class="preloader" src="/assets/img/logo.svg" alt="R3sourcer" width="120" height="120" />
    <router-outlet (activate)="loader = false" (deactivate)="loader = true"></router-outlet>
    <app-toast></app-toast>
  `
})
export class AppComponent {
  loader = true;

  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }
}
