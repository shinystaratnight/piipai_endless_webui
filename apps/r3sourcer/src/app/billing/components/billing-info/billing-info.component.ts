import { Component, Input, OnChanges } from '@angular/core';

import { Plan, Payment, BillingSubscription } from '../../models';

@Component({
  selector: 'webui-billing-info',
  templateUrl: 'billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})

export class BillingInfoComponent implements OnChanges {
  @Input() public payments!: Payment[];
  @Input() public currentPlan?: BillingSubscription;
  @Input() plans!: Plan[];
  @Input() currency = 'USD';

  types!: Record<string, string>;

  ngOnChanges() {
    this.types = {};

    if (this.plans) {
      for (const plan of this.plans) {
        const key = plan.id as number;

        this.types[key] = plan.type as string;
      }
    }
  }
}
