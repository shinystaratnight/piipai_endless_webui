import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="loader-wrapper" *ngIf="loader">
      <img
        class="loader"
        src="/assets/img/logo.svg"
        alt="R3sourcer"
        width="120"
        height="120"
      />
    </div>
    <router-outlet (activate)="loader = false" (deactivate)="loader = true"></router-outlet>
  `,
  styles: [`
    .loader {
      animation: shadow-pulse 2s infinite;
    }
  `]
})
export class AppComponent {
  loader = true;
}
