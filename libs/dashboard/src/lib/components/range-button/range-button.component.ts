import { Component, Input } from '@angular/core';
import { DateRange } from '@webui/core';

@Component({
  selector: 'app-range-button',
  templateUrl: './range-button.component.html',
  styleUrls: ['./range-button.component.scss']
})
export class RangeButtonComponent {
  @Input() dateRange: DateRange;
  @Input() active: boolean;
  @Input() key: string;
  @Input() label: string;
  @Input() disabled: boolean;
}
