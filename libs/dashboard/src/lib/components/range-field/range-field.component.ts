import { ChangeDetectionStrategy, Component, Input }  from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Format } from '@webui/core';

@Component({
  selector: 'app-range-field',
  templateUrl: './range-field.component.html',
  styleUrls: ['./range-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFieldComponent {
  @Input() controlName: string;
  @Input() name: string;
  @Input() translateKey: string;
  @Input() label: string;
  @Input() group: FormGroup;

  formats = {
    date: Format.Date
  };
}
