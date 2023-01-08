import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@webui/core';
import { Time } from '@webui/time';

import { Plan, BillingSubscription } from '../../models';

@Component({
  selector: 'webui-billing-plan',
  templateUrl: 'billing-plan.component.html',
  styleUrls: ['./billing-plan.component.scss'],
})
export class BillingPlanComponent implements OnChanges, OnDestroy {
  public modalRef!: NgbModalRef;
  types!: Record<string, string>;

  @Input() public saveProcess!: boolean;
  @Input() public currentPlan?: BillingSubscription;
  @Input() public workerCount!: number;
  @Input() public plans!: Plan[];
  @Input() public currency = 'USD';
  @Input() public cardInformation?: {
    payment_information_submited: true;
    card_number_last4: null | string;
  };

  @ViewChild('subscription') public modal!: ElementRef;

  @Output() public selectedPlan = new EventEmitter();
  @Output() public cancelingPlan = new EventEmitter();

  private _planControl = new FormControl(null);

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  get hasSelectedPlan() {
    if (!this.currentPlan) {
      return this._planControl.value;
    }

    return (
      this._planControl.value?.id !== this.currentPlan?.subscription_type ||
      this.currentPlan?.worker_count !== this.workerCount
    );
  }

  get hasAttachedCC() {
    return this.cardInformation?.payment_information_submited
  }

  get trialExpires() {
    const expires = Time.parse(this.userService.user?.data.end_trial_date);

    return expires.format();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['saveProcess']) {
      if (!changes['saveProcess'].currentValue && this.modalRef) {
        this.modalRef.close();
      }
    }

    if (changes['plans'] && changes['plans'].currentValue) {
      this._planControl.patchValue(
        this.plans?.find(
          (plan) => plan.id === this.currentPlan?.subscription_type
        )
      );
    }

    this.types = {};

    if (this.plans) {
      for (const plan of this.plans) {
        const key = plan.id as number;

        this.types[key] = plan.type as string;
      }
    }
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public planPay(plan: Plan): number {
    const start: number =
      plan.start_range_price_annual || plan.start_range_price_monthly;

    const price =
      start +
      (this.workerCount - plan.start_range) *
        (plan.step_change_val * plan.procent);

    return this.workerCount > plan.start_range ? Math.round(price) : start;
  }

  public planPayYear(plan: Plan): number {
    const price = this.planPay(plan);

    return Math.round(price * 12);
  }

  public selectPlan(plan: Plan) {
    this._planControl.patchValue(plan);
  }

  public checkActivePlan(plan: Plan) {
    const selectedPlan = this._planControl.value;

    return selectedPlan
      ? selectedPlan.id === plan.id
      : this.currentPlan?.subscription_type === plan.id;
  }

  public setPlan() {
    if (this.cardInformation?.payment_information_submited) {
      this.openModal();
    }
  }

  public changePlan() {
    this.openModal();
  }

  public cancelPlan() {
    this.cancelingPlan.emit();
  }

  public openModal() {
    this.modalRef = this.modalService.open(this.modal, { backdrop: 'static' });
  }

  savePlan() {
    const plan = this._planControl.value;

    const body = {
      type: plan.type,
      worker_count: this.workerCount,
      price:
        plan.type === 'monthly' ? this.planPay(plan) : this.planPayYear(plan),
      changed: this.currentPlan,
    };

    this.selectedPlan.emit(body);
  }
}
