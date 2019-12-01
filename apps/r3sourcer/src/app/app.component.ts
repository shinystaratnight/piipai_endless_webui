import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="site-loader-wrapper" *ngIf="loader">
      <img
        class="site-loader"
        src="/assets/img/logo.svg"
        alt="R3sourcer"
        width="120"
        height="120"
      />
    </div>
    <router-outlet (activate)="loader = false" (deactivate)="loader = true"></router-outlet>
  `,
})
export class AppComponent {
  loader = true;
}
