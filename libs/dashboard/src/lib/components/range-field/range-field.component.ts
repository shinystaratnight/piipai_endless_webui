import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DATE_FORMAT } from '@webui/time';

@Component({
  selector: 'webui-range-field',
  templateUrl: './range-field.component.html',
  styleUrls: ['./range-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFieldComponent {
  @Input() controlName!: string;
  @Input() name!: string;
  @Input() translateKey!: string;
  @Input() label!: string;
  @Input() group!: FormGroup;

  formats = {
    date: DATE_FORMAT,
  };
}
