import { Component, Input } from '@angular/core';

@Component({
  selector: 'info',
  template: `
    <i class="info"
      *ngIf="description"
      [placement]="placement || 'right'"
      [ngbTooltip]="description">
        {{text || 'i'}}
    </i>
  `,
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  @Input() public description: string;
  @Input() public text: string;
  @Input() public placement: string;
}
