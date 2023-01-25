import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BillingService } from './services/billing-service';

import { Plan, BillingSubscription } from './models';

import {
  ToastService,
  EventService,
  SiteSettingsService,
  MessageType,
  EventType,
} from '@webui/core';
import { Subscription } from 'rxjs';
import { User } from '@webui/models';

@Component({
  selector: 'webui-billing-page',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BillingComponent implements OnInit, OnDestroy {
  public user!: User;
  public pagesList!: any[];
  public currentPlan?: BillingSubscription;
  public checkInformation?: {
    payment_information_submited: true;
    card_number_last4: null | string;
  };
  public saveProcess!: boolean;
  public cancelProcess!: boolean;
  public plans!: Plan[];
  public currency!: string;

  subscriptions: Subscription[] = [];

  constructor(
    // private userService: UserService,
    private billingService: BillingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastService,
    private eventService: EventService,
    private siteSettings: SiteSettingsService,
    private toastrService: ToastService
  ) {}

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];
    const subscriptions: any[] =
      this.route.snapshot.data['subscription'].subscriptions;

    this.currency = this.siteSettings.settings.currency;

    this.currentPlan = subscriptions && subscriptions.find((el) => el.active);

    this.checkPaymentInformation();

    this.setActivePage(this.pagesList, `${this.router.url}/`);

    this.billingService.getSubscriptionTypes().subscribe((res) => {
      if (Array.isArray(res)) {
        return;
      }

      const plans: Plan[] = [];

      for (const plan of res.subscription_types) {
        if (plan.table_text) {
          plan.table = plan.table_text.split(';');
        }

        plans.push({
          ...plan,
          procent: plan.percentage_discount
            ? (100 - plan.percentage_discount) / 100
            : 1,
        });
      }

      this.plans = plans;
    });

    this.subscriptions.push(
      this.eventService.event$.subscribe((event) => {
        if (event === EventType.PurposeChanged) {
          this.router.navigateByUrl('');
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // public updateNavigation(role: string) {
  //   // this.userService.currentRole(role);
  //   setTimeout(() => {
  //     this.router.navigate(['']);
  //   }, 150);
  // }

  public selectPlan(plan: Plan) {
    const changed = plan.changed;
    plan.changed = undefined;

    this.saveProcess = true;
    this.billingService.setPlan(plan).subscribe({
      next: () => {
        this.toastr.sendMessage(
          changed
            ? 'Subscription has been updated'
            : 'Subscription has been created',
          MessageType.Success
        );

        this.eventService.emit(EventType.SubscriptionChanged);

        this.getSubscriptionInformation();
      },
      complete: () => (this.saveProcess = false),
    });
  }

  public getSubscriptionInformation() {
    this.billingService.getSubscriptionInfo().subscribe((data: any) => {
      this.currentPlan = data.subscriptions.find((el: any) => el.active);
    });
  }

  public checkPaymentInformation() {
    this.billingService
      .checkPaymentInformation()
      .subscribe((data) => (this.checkInformation = data));
  }

  public cancelPlan() {
    this.billingService.cancelSubscription().subscribe(() => {
      this.currentPlan = undefined;
      this.toastr.sendMessage(
        'Subscription has been canceled',
        MessageType.Success
      );
      this.eventService.emit(EventType.SubscriptionChanged);
    });
  }

  public setActivePage(pages: any[], path: string) {
    let active = false;
    pages.forEach((page) => {
      if (path === page.url && page.url !== '/') {
        active = true;
        page.active = true;
      } else if (page.children) {
        page.active = this.setActivePage(page.children, path);
        active = active || page.active;
      }
    });
    return active;
  }

  onCardChange() {
    this.toastrService.sendMessage(
      'message.credit_card_updated',
      MessageType.Success
    );
    this.checkPaymentInformation();
  }

  onRemoveCC(): void {
    this.billingService.removeCC().subscribe(() => {
      this.toastrService.sendMessage(
        'message.credit_card_removed',
        MessageType.Success
      );

      this.checkPaymentInformation();
    });
  }
}
