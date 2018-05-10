import { Component, OnInit } from '@angular/core';

import { BillingService } from '../../services/billing-service';

@Component({
  selector: 'billing-info',
  templateUrl: 'billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})

export class BillingInfoComponent implements OnInit {

  public payments: any[];

  constructor(
    private billingService: BillingService
  ) { }

  public ngOnInit() {
    this.payments = [];
  }
}
