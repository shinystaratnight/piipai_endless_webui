import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'webui-evaluate-field',
  templateUrl: './evaluate-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateFieldComponent implements OnInit {
  @Input() evaluated!: boolean;
  @Input() evaluatedScore!: string;
  score!: number;
  hovered: any;

  ngOnInit() {
    this.score = parseInt(this.evaluatedScore) || 0;
  }
}
