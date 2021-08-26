import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-evaluate-field',
  templateUrl: './evaluate-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateFieldComponent implements OnInit {
  @Input() evaluated: boolean;
  @Input() evaluatedScore: number;
  score: number;
  hovered: any;

  ngOnInit() {
    this.score = this.evaluatedScore;
  }
}
