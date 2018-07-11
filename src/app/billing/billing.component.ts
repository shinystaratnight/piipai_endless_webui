import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User, UserService } from '../services/user.service';
import { BillingService } from './services/billing-service';

import { Plan, Payment, CheckInformation, BillingSubscription } from './models';

@Component({
  selector: 'billing-page',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  public user: User;
  public pagesList: any[];
  public currentPlan: BillingSubscription;
  public payments: Payment[];
  public checkInformation: boolean;

  constructor(
    private userService: UserService,
    private billingService: BillingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checkInformation = true;
  }

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];

    this.getSubscriptionInformation();
    this.getPaymets();
    this.checkPaymentInformation();
  }

  public updateNavigation(role: string) {
    this.userService.currentRole(role);
    setTimeout(() => {
      this.router.navigate(['']);
    }, 150);
  }

  public selectPlan(plan: Plan) {
    this.billingService.setPlan(plan)
      .subscribe(() => {
        this.getSubscriptionInformation();
      });
  }

  public getSubscriptionInformation() {
    this.billingService.getSubscriptionInfo()
      .subscribe(
        (data: any) => {
          this.currentPlan = data.subscriptions.find((el) => el.active);
        });
  }

  public getPaymets() {
    this.billingService.payments()
      .subscribe(
        (data: any) => this.payments = data.payments
      );
  }

  public checkPaymentInformation() {
    this.billingService.checkPaymentInformation()
      .subscribe(
        (data: any) => this.checkInformation = data.payment_information_submited
      );
  }

  public cancelPlan() {
    this.billingService.cancelSubscription()
      .subscribe();
  }
}
