import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User, UserService } from '../services/user.service';
import { BillingService } from './services/billing-service';

import { Plan, Payment } from './models';

@Component({
  selector: 'billing-page',
  templateUrl: './billing.component.html'
})
export class BillingComponent implements OnInit {
  public user: User;
  public pagesList: any[];
  public currentPlan: Plan;
  public payments: Payment[];

  constructor(
    private userService: UserService,
    private billingService: BillingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];

    this.billingService.getSubscriptionStatus()
      .subscribe((plan: Plan) => this.currentPlan = plan);

    this.billingService.getSubscriptionInfo()
      .subscribe((payments: Payment[]) => this.payments = payments);
  }

  public updateNavigation(role: string) {
    this.userService.currentRole(role);
    setTimeout(() => {
      this.router.navigate(['']);
    }, 150);
  }

  public selectPlan(plan: Plan) {
    this.billingService.setPlan(plan)
      .subscribe();
  }
}
