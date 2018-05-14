import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit
} from '@angular/core';

import { Plan } from '../../models';

@Component({
  selector: 'billing-plan',
  templateUrl: 'billing-plan.component.html',
  styleUrls: ['./billing-plan.component.scss']
})

export class BillingPlanComponent implements OnInit {

  public workerCount: number;
  public plans: Plan[];

  @Input() public currentPlan: Plan;

  @Output() public selectedPlan = new EventEmitter();

  public ngOnInit() {
    this.workerCount = this.currentPlan ? this.currentPlan.worker_count : 1;
    this.plans = [
      {
        id: 1,
        name: 'Cancel anytime',
        type: 'monthly',
        description: 'Monthly',
        save: false,
        pay: 13,
        procent: 1,
        active: this.currentPlan && this.currentPlan.type === 'monthly',
        start: 120
      },
      {
        id: 2,
        name: 'Annual plan',
        type: 'annual',
        description: 'Annually',
        save: true,
        pay: 10,
        procent: 0.75,
        active: this.currentPlan && this.currentPlan.type === 'annual',
        start: 90
      }
    ];
  }

  public planPay(plan: Plan, procent?: number): number {
    const price = 120 + (this.workerCount - 10) * 11;

    return this.workerCount > 10 ? Math.round(price * procent) : plan.start;
  }

  public planPayYear(plan: Plan, procent?: number): number {
    const price = this.planPay(plan, 1);

    return Math.round(price * 12 * procent);
  }

  public selectPlan(plan) {
    const body = {
      type: plan.type,
      worker_count: this.workerCount,
      price: plan.id === 1 ? this.planPay(plan) : this.planPayYear(plan, plan.procent)
    };

    this.selectedPlan.emit(body);
  }
}
