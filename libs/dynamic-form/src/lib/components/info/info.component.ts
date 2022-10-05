import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'webui-info',
  template: `
    <i class="info"
      [class.danger]="danger"
      *ngIf="description"
      triggers="{{triggersType || 'mouseover:mouseout'}}"
      [placement]="placement || 'right'"
      [ngbTooltip]="description">
        {{text || 'i'}}
    </i>
  `,
  styleUrls: ['./info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InfoComponent implements OnInit {
  @Input() public description!: string | TemplateRef<any>;
  @Input() public text!: string;
  @Input() public placement!: string;
  @Input() public triggersType!: string;
  @Input() public danger!: boolean;

  public config: any;

  public ngOnInit() {
    if (this.config && this.config.description) {
      this.description = this.config.description;
    }
  }
}
