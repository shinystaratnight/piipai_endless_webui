import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Plan, BillingSubscription } from '../../models';

@Component({
  selector: 'app-billing-plan',
  templateUrl: 'billing-plan.component.html',
  styleUrls: ['./billing-plan.component.scss']
})

export class BillingPlanComponent implements OnChanges {

  public plans: Plan[] = [
    {
      id: 1,
      name: 'Cancel anytime',
      type: 'monthly',
      description: 'Monthly',
      pay: 13,
      procent: 1,
      active: false,
      start: 120
    },
    {
      id: 2,
      name: 'Annual plan',
      type: 'annual',
      description: 'Annually',
      save: true,
      pay: 10,
      procent: 0.75,
      start: 90
    }
  ];
  public changeAction: boolean;
  public modalRef: NgbModalRef;

  @Input() public saveProcess: boolean;
  @Input() public currentPlan: BillingSubscription;
  @Input() public workerCount: number;

  @ViewChild('subscription') public modal;

  @Output() public selectedPlan = new EventEmitter();
  @Output() public cancelingPlan = new EventEmitter();

  constructor(
    private modalService: NgbModal
  ) {
    this.changeAction = false;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.saveProcess) {
      if (!changes.saveProcess.currentValue && this.modalRef) {
        this.modalRef.close();
      }
    }
  }

  public planPay(plan: Plan, procent: number = 1): number {
    const price = 120 + (this.workerCount - 10) * 11;

    return this.workerCount > 10 ? Math.round(price * procent) : plan.start;
  }

  public planPayYear(plan: Plan, procent?: number): number {
    const price = this.planPay(plan, 1);

    return Math.round(price * 12 * procent);
  }

  public selectPlan(plan) {
    this.changeAction = false;

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
    this.changeAction = true;

    this.openModal();
  }

  public cancelPlan() {
    this.cancelingPlan.emit();
  }

  public openModal() {
    this.modalRef = this.modalService.open(this.modal);
  }
}
