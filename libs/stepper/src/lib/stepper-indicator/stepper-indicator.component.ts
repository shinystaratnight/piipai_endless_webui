import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface IStep {
  label?: number;
  active: boolean;
}

@Component({
  selector: 'webui-stepper-indicator',
  templateUrl: './stepper-indicator.component.html',
  styleUrls: ['./stepper-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperIndicatorComponent implements OnInit, OnChanges {
  private steps: BehaviorSubject<IStep[]> = new BehaviorSubject([] as IStep[]);

  @Input() public currentStep?: number;
  @Input() public stepCount?: number;

  public steps$: Observable<IStep[]> = this.steps.asObservable();

  public ngOnInit(): void {
    this.generateSteps();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes['currentStep'].isFirstChange()) {
      this.generateSteps();
    }
  }

  public get linearGradient(): { [key: string]: string } {
    const points = [
      '#2196F3 0%',
      `#2196F3 ${
        (100 / (this.stepCount || 1)) * ((this.currentStep || 1) + 1)
      }%`,
      'rgba(40, 163, 252, 0.03) 100%'
    ];

    return {
      background: `linear-gradient(90deg, ${points.join(', ')})`
    };
  }

  private generateSteps(): void {
    const previousValue = this.steps.value;
    let nextValue: IStep[] = previousValue;

    if (!previousValue.length) {
      nextValue = new Array(this.stepCount).fill('').map((el, index) => ({
        label: el + (index + 1),
        active: index <= (this.currentStep || 0)
      }));
    } else {
      nextValue.forEach(
        (el, index) => (el.active = index <= (this.currentStep || 0))
      );
    }

    this.steps.next(nextValue);
  }
}
