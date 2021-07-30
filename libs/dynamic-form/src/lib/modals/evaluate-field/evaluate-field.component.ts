import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-evaluate-field',
  templateUrl: './evaluate-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateFieldComponent implements OnInit {
  @Input() evaluated: boolean;
  @Input() evaluatedScore: number;
  score: number;

  ngOnInit() {
    this.score = this.evaluatedScore
  }
}
