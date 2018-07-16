import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User, UserService } from '../services/user.service';
import { BillingService } from './services/billing-service';

import { Plan, Payment, BillingSubscription } from './models';

import { ToastrService } from '../shared/services';

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
  public saveProcess: boolean;
  public cancelProcess: boolean;

  constructor(
    private userService: UserService,
    private billingService: BillingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.checkInformation = true;
  }

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];
    const subscriptions = this.route.snapshot.data['subscription'].subscriptions;

    this.currentPlan = subscriptions && subscriptions.find((el) => el.active);

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
    const changed = plan.changed;
    plan.changed = undefined;

    this.saveProcess = true;
    this.billingService.setPlan(plan)
      .subscribe(
        () => {
          this.saveProcess = false;

          if (changed) {
            this.toastr.sendMessage('Subscription has been updated', 'success');
          } else {
            this.toastr.sendMessage('Subscription has been created', 'success');
          }

          this.getSubscriptionInformation();
        },
        () => {
          this.saveProcess = false;
        }
    );
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
    this.cancelProcess = true;
    this.billingService.cancelSubscription()
      .subscribe(() => {
        this.currentPlan = undefined;
        this.cancelProcess = false;
        this.toastr.sendMessage('Subscription has been canceled', 'success');
      },
      () => {
        this.cancelProcess = false;
      });
  }
}
