import { Component, Input } from '@angular/core';

@Component({
  selector: 'webui-range-button',
  templateUrl: './range-button.component.html',
  styleUrls: ['./range-button.component.scss']
})
export class RangeButtonComponent {
  @Input() dateRange!: string;
  @Input() active!: boolean;
  @Input() key!: string;
  @Input() label!: string;
  @Input() disabled!: boolean;
}
