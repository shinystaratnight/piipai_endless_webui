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
        name: 'Cancel anytime',
        type: 'monthly',
        description: 'Monthly',
        save: false,
        pay: 13,
        price: 11,
        active: this.currentPlan && this.currentPlan.type === 'monthly',
        start: 120
      },
      {
        name: 'Annual plan',
        type: 'annual',
        description: 'Annually',
        save: true,
        pay: 10,
        price: 9,
        active: this.currentPlan && this.currentPlan.type === 'annual',
        start: 90
      }
    ];
  }

  public planPay(price: number, start: number): number {
    return this.workerCount > 10 ? start + (this.workerCount - 10) * price : start;
  }

  public planPayYear(price: number, start: number): number {
    return this.planPay(price, start) * 12;
  }

  public selectPlan(plan) {
    const body = {
      type: plan.type,
      worker_count: this.workerCount,
      price: this.planPay(plan.price, plan.start)
    };

    this.selectedPlan.emit(body);
  }
}
