import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'webui-loader',
  template: `
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {}
