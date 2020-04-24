import { Component, Input, OnChanges } from '@angular/core';

import { Plan, Payment, BillingSubscription } from '../../models';

@Component({
  selector: 'app-billing-info',
  templateUrl: 'billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})

export class BillingInfoComponent implements OnChanges {
  @Input() public payments: Payment[];
  @Input() public currentPlan: BillingSubscription;
  @Input() plans: Plan[];
  @Input() currency: string = 'USD';

  types: any;

  ngOnChanges() {
    this.types = {};

    if (this.plans) {
      Object.keys(this.plans).forEach((key) => {
        this.types[this.plans[key].id] = this.plans[key].type;
      });
    }
  }
}
