import { Component, Input } from '@angular/core';

@Component({
  selector: 'webui-spinner',
  template: `
    <div class="lds-spinner" [class.sm]="sm">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
  </div>
  `,
  styleUrls: ['./spinner.component.scss']
})

export class SpinnerComponent {
  @Input() sm?: boolean;
}
