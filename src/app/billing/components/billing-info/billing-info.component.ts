import { Component, Input } from '@angular/core';

import { Plan, Payment } from '../../models';

@Component({
  selector: 'billing-info',
  templateUrl: 'billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})

export class BillingInfoComponent {
  @Input() public payments: Payment[];
  @Input() public currentPlan: Plan;
}
