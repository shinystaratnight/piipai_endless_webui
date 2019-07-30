import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { BillingService } from './billing-service';

@Injectable()
export class SubscriptionResolver implements Resolve<any> {

  constructor(private service: BillingService) { }

  public resolve() {
    return this.service.getSubscriptionInfo();
  }
}
