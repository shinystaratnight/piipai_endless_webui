import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'info',
  template: `
    <i class="info"
      *ngIf="description"
      triggers="{{triggersType || 'mouseover:mouseout'}}"
      [placement]="placement || 'right'"
      [ngbTooltip]="description">
        {{text || 'i'}}
    </i>
  `,
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @Input() public description: string;
  @Input() public text: string;
  @Input() public placement: string;
  @Input() public triggersType: string;

  public config: any;

  public ngOnInit() {
    if (this.config.description) {
      this.description = this.config.description;
    }
  }
}
