import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BillingService } from './services/billing-service';

import { Plan, Payment, BillingSubscription } from './models';

import { User } from '@webui/data';
import { ToastService, EventService, EventType, SiteSettingsService, MessageType } from '@webui/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-billing-page',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingComponent implements OnInit, OnDestroy {
  public user: User;
  public pagesList: any[];
  public currentPlan: BillingSubscription;
  public payments: Payment[];
  public checkInformation: boolean;
  public saveProcess: boolean;
  public cancelProcess: boolean;
  public plans: Plan[];
  public currency: string;

  subscriptions: Subscription[] = [];

  constructor(
    // private userService: UserService,
    private billingService: BillingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastService,
    private eventService: EventService,
    private siteSettings: SiteSettingsService
  ) {
    this.checkInformation = true;
  }

  public ngOnInit() {
    this.user = this.route.snapshot.data['user'];
    this.pagesList = this.route.snapshot.data['pagesList'];
    const subscriptions = this.route.snapshot.data['subscription'].subscriptions;

    this.currency = this.siteSettings.settings.currency;

    this.currentPlan = subscriptions && subscriptions.find(el => el.active);

    this.getPaymets();
    this.checkPaymentInformation();

    this.setActivePage(this.pagesList, `${this.router.url}/`);

    this.billingService
      .getSubscriptionTypes()
      .subscribe((res: { subscription_types: Plan[] }) => {
        this.plans = Object.keys(res.subscription_types).map(key => {
          if (res.subscription_types[key].table_text) {
            res.subscription_types[key].table = res.subscription_types[
              key
            ].table_text.split(';');
          }
          return {
            ...res.subscription_types[key],
            procent: res.subscription_types[key].percentage_discount
              ? (100 - res.subscription_types[key].percentage_discount) / 100
              : 1
          };
        });
      });

    this.subscriptions.push(
      this.eventService.event$.subscribe((type: EventType) => {
        setTimeout(() => {
          this.router.navigate(['']);
        }, 150);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    this.billingService.setPlan(plan).subscribe(
      () => {
        this.saveProcess = false;

        if (changed) {
          this.toastr.sendMessage('Subscription has been updated', MessageType.Success);
        } else {
          this.toastr.sendMessage('Subscription has been created', MessageType.Success);
        }

        this.getSubscriptionInformation();
      },
      () => {
        this.saveProcess = false;
      }
    );
  }

  public getSubscriptionInformation() {
    this.billingService.getSubscriptionInfo().subscribe((data: any) => {
      this.currentPlan = data.subscriptions.find(el => el.active);
    });
  }

  public getPaymets() {
    this.billingService
      .payments()
      .subscribe((data: any) => (this.payments = data.payments));
  }

  public checkPaymentInformation() {
    this.billingService
      .checkPaymentInformation()
      .subscribe(
        (data: any) =>
          (this.checkInformation = data.payment_information_submited)
      );
  }

  public cancelPlan() {
    this.billingService.cancelSubscription().subscribe(() => {
      this.currentPlan = undefined;
      this.toastr.sendMessage('Subscription has been canceled', MessageType.Success);
    });
  }

  public setActivePage(pages, path) {
    let active = false;
    pages.forEach(page => {
      if (path === page.url && page.url !== '/') {
        active = true;
        page.active = true;
      } else if (page.childrens) {
        page.active = this.setActivePage(page.childrens, path);
        active = active || page.active;
      }
    });
    return active;
  }

  onCardChange() {
    this.checkPaymentInformation();
  }
}
