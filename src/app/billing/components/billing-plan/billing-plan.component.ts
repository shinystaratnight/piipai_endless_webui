import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Plan, BillingSubscription } from '../../models';
import { BillingService } from '../../services/billing-service';

@Component({
  selector: 'app-billing-plan',
  templateUrl: 'billing-plan.component.html',
  styleUrls: ['./billing-plan.component.scss']
})

export class BillingPlanComponent implements OnInit, OnChanges, OnDestroy {

  public plans: Plan[] = [
    {
      type: 'monthly',
      procent: 1,
      pay: 13,
    },
    {
      type: 'annual',
      save: true,
      procent: 0.75,
      pay: 10
    }
  ];
  public modalRef: NgbModalRef;

  @Input() public saveProcess: boolean;
  @Input() public currentPlan: BillingSubscription;
  @Input() public workerCount: number;

  @ViewChild('subscription') public modal;

  @Output() public selectedPlan = new EventEmitter();
  @Output() public cancelingPlan = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private billingService: BillingService
  ) {}

  public ngOnInit() {
    this.billingService.getSubscriptionTypes()
      .subscribe((res: { subscription_types: Plan[] }) => {
        this.plans = this.plans.map((el) => {
          const plan = res.subscription_types.find((item) => item.type === el.type);
          if (plan.table_text) {
            plan.table = plan.table_text.split(';');
          }
          return {
            ...el,
            ...plan
          };
        });
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.saveProcess) {
      if (!changes.saveProcess.currentValue && this.modalRef) {
        this.modalRef.close();
      }
    }
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public planPay(plan: Plan, procent: number = 1): number {
    const start = plan.start_range_price_annual || plan.start_range_price_monthly;

    const price = start + (this.workerCount - plan.start_range) * plan.step_change_val;

    return this.workerCount > plan.start_range ? Math.round(price * procent) : start;
  }

  public planPayYear(plan: Plan, procent?: number): number {
    const price = this.planPay(plan, 1);

    return Math.round(price * 12 * procent);
  }

  public selectPlan(plan) {
    const body = {
      type: plan.type,
      worker_count: this.workerCount,
      price: plan.id === 1 ? this.planPay(plan) : this.planPayYear(plan, plan.procent),
      changed: this.currentPlan
    };

    this.selectedPlan.emit(body);
  }

  public checkActivePlan(plan: Plan) {
    if (this.currentPlan) {
      return this.currentPlan.type === plan.type;
    }
  }

  public setPlan() {
    this.openModal();
  }

  public changePlan() {
    this.openModal();
  }

  public cancelPlan() {
    this.cancelingPlan.emit();
  }

  public openModal() {
    this.modalRef = this.modalService.open(this.modal);
  }
}
