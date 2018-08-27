import { Component, Input } from '@angular/core';

import { Payment, BillingSubscription } from '../../models';
import { metadata } from './billing-info.metadata';

@Component({
  selector: 'billing-info',
  templateUrl: 'billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})

export class BillingInfoComponent {
  @Input() public payments: Payment[];
  @Input() public currentPlan: BillingSubscription;

  public config = metadata;

  public types = {
    annual: 'Annual',
    monthly: 'Monthly'
  };
}
