import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `,
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {}
